import { model } from "mongoose";
import { OrderSchema } from "../schemas/order-schema";

const Order = model("order", OrderSchema);

export class OrderModel {
  //생성
  async createOrder(orderinfo) {
    const createNewOrder = await Order.create(orderinfo);
    return createNewOrder;
  }

  //조회
  async findAllOrder() {
    const orders = await Order.find({});
    return orders;
  }

  async updateOrder() {
    //사용자 _id를 필터 변수에 넣어서 사용자가 주문한 주문 내역을 보여줘야 하는데... 어케 하쥬?
    // 일단은 ordername을 받아서 주문 데이터를 불러와서 수정할 수 있게 할까?
    const filter = { orderName: orderName };
    const updateOrder = await Order.find;
  }

  async deleteById(orderId) {
    const deleteOrderId = await Order.remove({ _id: orderId });
    return deleteOrderId;
  }
}

const orderModel = new OrderModel();

export { orderModel };
