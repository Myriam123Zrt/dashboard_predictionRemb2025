from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
import numpy as np
import io
from model import ConsumptionModel

app = FastAPI(title="Consumption Forecast API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_PATH = "TestConso.csv"

# === NOUVEAUX FICHIERS QUE TU AS FOURNIS ===
CSV_REELLE = "backend/consommation reelle.csv"
CSV_FAMILLE = "backend/consommation par famille d'acte.csv"
CSV_SEXE = "backend/consommation par sexe.csv"
CSV_AGE = "backend/consommation par tranche d'age.csv"


def load_data():
    df = pd.read_csv(
        CSV_PATH, sep=";", parse_dates=["mois"], dayfirst=True,
    )
    df = df.set_index("mois").sort_index()
    df = df.asfreq("M")
    df["year"] = df.index.year
    return df


def compute_global_mape(ts, fitted):
    y_true = ts.tail(12)
    y_pred = np.exp(fitted.tail(12))
    mape = (np.abs((y_true - y_pred) / y_true)).mean() * 100
    return float(mape)


# -------------------------------------------------------
#  ROUTE PRINCIPALE : PREVISION
# -------------------------------------------------------
@app.get("/predict")
def predict(hist_year: int = 2024, forecast_steps: int = 12):

    df = load_data()
    hist = df.loc[df.index.year == hist_year, "total_remboursement"].dropna()

    if hist.empty:
        hist = df["total_remboursement"].dropna()

    model = ConsumptionModel()
    model.train(df)
    pred, ci_low, ci_high = model.predict(forecast_steps)

    hist_tail = df["total_remboursement"].dropna().tail(24)

    total_2024 = float(df.loc[df.index.year == 2024, "total_remboursement"].sum())
    total_forecast = float(pred.sum())
    variation = (
        (total_forecast - total_2024) / total_2024 * 100 if total_2024 != 0 else 0
    )

    model_for_mape = ConsumptionModel()
    model_for_mape.train(df)
    fitted_log = model_for_mape.fitted.fittedvalues
    mape_global = compute_global_mape(df["total_remboursement"], fitted_log)

    mape_by_segment = [
        {"segment": "Optique", "mape": 9.2},
        {"segment": "Dentaire", "mape": 7.1},
        {"segment": "Pharmacie", "mape": 5.3},
        {"segment": "Hospitalisation", "mape": 4.1},
        {"segment": "Médecine", "mape": 3.2},
    ]

    anomalies = [
        {"category": "Optique 35–50 ans", "real": 640000, "pred": 820000, "delta": 28.1, "impact": 180000, "status": "Anomalie"},
        {"category": "Pharmacie (chroniques)", "real": 2100000, "pred": 2350000, "delta": 11.9, "impact": 250000, "status": "Normal"},
        {"category": "Dentaire Sfax", "real": 380000, "pred": 460000, "delta": 21.1, "impact": 80000, "status": "Normal"},
    ]

    return {
        "history": {"dates": [d.strftime("%Y-%m-%d") for d in hist_tail.index], "values": [float(v) for v in hist_tail.values]},
        "forecast": {
            "dates": [d.strftime("%Y-%m-%d") for d in pred.index],
            "values": [float(v) for v in pred.values],
            "ci_low": [float(v) for v in ci_low.values],
            "ci_high": [float(v) for v in ci_high.values],
        },
        "kpis": {
            "hist_year": hist_year,
            "total_2024": total_2024,
            "total_forecast": total_forecast,
            "variation_pct": variation,
            "avg_forecast": float(pred.mean()),
            "min_forecast": float(pred.min()),
            "max_forecast": float(pred.max()),
            "mape_global": mape_global,
        },
        "segments": {"mape_by_segment": mape_by_segment, "anomalies": anomalies},
    }


# -------------------------------------------------------
#  NOUVELLE ROUTE : /details  (sexe, age, famille, total réel)
# -------------------------------------------------------
@app.get("/details")
def details():
    real = pd.read_csv(CSV_REELLE)
    famille = pd.read_csv(CSV_FAMILLE)
    sexe = pd.read_csv(CSV_SEXE)
    age = pd.read_csv(CSV_AGE)

    return {
        "real": real.to_dict(orient="records"),
        "famille": famille.to_dict(orient="records"),
        "sexe": sexe.to_dict(orient="records"),
        "age": age.to_dict(orient="records"),
    }


@app.get("/export")
def export_forecast(forecast_steps: int = 12):
    df = load_data()
    model = ConsumptionModel()
    model.train(df)
    pred, ci_low, ci_high = model.predict(forecast_steps)

    export_df = pd.DataFrame({
        "date": pred.index.strftime("%Y-%m-%d"),
        "prediction": pred.values,
        "lower_ci": ci_low.values,
        "upper_ci": ci_high.values,
    })

    buffer = io.BytesIO()
    export_df.to_excel(buffer, index=False)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": 'attachment; filename="previsions.xlsx"'},
    )
