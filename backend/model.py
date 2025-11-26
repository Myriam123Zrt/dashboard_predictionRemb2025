import pandas as pd
import numpy as np
from statsmodels.tsa.statespace.sarimax import SARIMAX

class ConsumptionModel:
    def __init__(self):
        self.fitted = None

    def train(self, df: pd.DataFrame):
        df = df.sort_index()
        ts = df["total_remboursement"].astype(float)
        ts_log = np.log(ts)
        model = SARIMAX(ts_log, order=(0, 1, 0), seasonal_order=(0, 1, 1, 12))
        self.fitted = model.fit(disp=False)

    def predict(self, steps: int = 12):
        if self.fitted is None:
            raise RuntimeError("Model must be trained before prediction.")
        forecast = self.fitted.get_forecast(steps=steps)
        pred = np.exp(forecast.predicted_mean)
        ci = forecast.conf_int()
        ci_low = np.exp(ci.iloc[:, 0])
        ci_high = np.exp(ci.iloc[:, 1])
        return pred, ci_low, ci_high
