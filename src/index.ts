import { CONFIG } from "./config";
import { BitGetExchange } from "./exchange/bitget";
import cors from "cors";
import express from "express";
import { OrderType } from "./types/IExchange";

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
  /*
    *  Place order
    *  @param {marginCoin,symbol, side,} req.body
    * 
    * @returns {Promise<Order | null>} - order
    * @memberof BitGetExchange
    */

  app.post("/api/mix/v1/order/placeOrder", async (req, res) => {
    const { symbol, side, type, size, price, marginCoin } = req.body;
    const bitget = new BitGetExchange(CONFIG.BITGET_API_KEY, CONFIG.BITGET_API_SECRET, CONFIG.BITGET_API_PASSPHRASE);
    try {
      const order = await bitget.placeOrder({
        symbol,
        marginCoin,
        size,
        price,
        side,
        orderType: "limit",

      });
      res.json(order);
    } catch (error) {
      res.json(error);
    }
  });
  /*
  *  Get order
  *  @param {symbol, side, orderId} req.query
  *   
  */

  app.get("/api/mix/v1/trace/currentTrack", async (req, res) => {
    const { symbol, productType, pageSize, pageNo } = req.body;
    const bitget = new BitGetExchange(CONFIG.BITGET_API_KEY, CONFIG.BITGET_API_SECRET, CONFIG.BITGET_API_PASSPHRASE);
    try {
      const order = await bitget.getOpenOrders({
        symbol: symbol,
        productType: productType,
        pageSize: pageSize,
        pageNo: pageNo,
      });
      res.json(order);
    } catch (error) {
      res.json(error);
    }
  })

  /*
  *  Get Traders List
  *
  */




  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
};
Main();
