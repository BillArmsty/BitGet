import { CONFIG } from "./config";
import { BitGetExchange } from "./exchange/bitget";
import cors from "cors";
import express from "express";

const Main = () => {
  const PORT = process.env.PORT!;
  const app = express();
  app.use(cors());
  app.use(
    express.json({
      type: ["application/json", "text/plain"],
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.post("/api/mix/v1/order/placeOrder", async (req, res) => {
    const { symbol, side, type, size, price } = req.body;
    const bitget = new BitGetExchange(CONFIG.BITGET_API_KEY , CONFIG.BITGET_API_SECRET);
    const order = await bitget.placeOrder({
      symbol,
      marginCoin: "ETHUSDT_UMCBL",
      size,
      price,
      side,
      orderType: type,
    });
    res.json(order);
  });
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
};
