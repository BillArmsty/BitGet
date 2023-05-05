import {
  FuturesClient,

  FuturesOrderSide,
  FuturesOrderType,
  FuturesProductType,
  NewFuturesOrder,
  OrderTimeInForce,
  serializeParams,
} from "bitget-api";
import { OrderSide, Order, OrderType } from "../types/IExchange";
import { sleep } from "../utils/util";

/**
 *  BitGet exchange Implementation.
 * @class
 * @extends Exchange
 *
 */
export class BitGetExchange {
  client: FuturesClient;

  constructor(
    apiKey: string,
    apiSecret: string,
    apiPass: string,
    baseUrl?: string
  ) {
    this.client = new FuturesClient({
      apiKey,
      apiSecret,
      apiPass,
      baseUrl,
    });
  }

  getMarkPrice = async (symbol: string) => {
    const markPrice = await this.client.getMarkPrice(symbol);
    return markPrice;
  };

  getMarket = async (symbol: string) => {
    const market = await this.client.getTicker(symbol);
    return market;
  };

  placeOrder = async (_params: {
    symbol: string;
    marginCoin: string;
    size: string;
    price?: string;
    side: FuturesOrderSide;
    orderType: FuturesOrderType;
    timeInForceValue?: OrderTimeInForce;
    clientOid?: string;
    presetTakeProfitPrice?: string;
    presetStopLossPrice?: string;
  }): Promise<Order | null> => {
    const { data, code, msg } = await this.client.submitOrder(_params);
    try {
      if (code === "0" && data) {
        return {
          id: data.orderId,
          market: data.symbol,
          side: data.side,
          type: data.type,
          price: data.price,
          quantity: data.size,
          status: data.status,
          filled: data.filledSize,
          remaining: data.remainingSize,
          createdAt: new Date(data.createdAt),
          clientId: data.clientOid,
        };
      }
      if (msg?.includes("insufficient balance")) {
        await sleep(1500);
      }
      throw new Error(msg);
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  cancelOrder = async (_params: {
    symbol: string;
    marginCoin: string;
    orderId: string;
  }): Promise<boolean> => {
    const { code, msg } = await this.client.cancelOrder(
      _params.symbol,
      _params.marginCoin,
      _params.orderId
    );
    if (code === "0") {
      return true;
    }
    throw new Error(msg);
  };

  cancelAllOrders = async (_params: {
    productType: FuturesProductType;
    marginCoin: string;
  }): Promise<boolean> => {
    const { code, msg } = await this.client.cancelAllOrders(
      _params.productType,
      _params.marginCoin
    );
    if (code === "0") {
      return true;
    }
    throw new Error(msg);
  };



  //Get Trader Open Orders

  getOpenOrders = async (_params: {
    symbol: string;
    productType: FuturesProductType;
    pageSize: number;
    pageNo: number;
  }): Promise<Order> => {
    const { data, code, msg } = await this.client.getCopyTraderOpenOrder(
      _params.symbol,
      _params.productType,
      _params.pageSize,
      _params.pageNo)
    if (code === "00000") {
      return data;
    }
    throw new Error(msg);

  }

  //Get Traders List
 

  //Get Trader Info



}
