# AI对话非流式调用流程

1. 输入问题后，调用 `sendMessage`函数，开始触发逻辑流程，如果最后一条数据还处于 `thinking` ,就不执行下一步操作，否则把用户提问的消息，添加到msgList数组对象中，并触发 `MESSAGE_SEND`给全局事件发送消息，调用ai模型
2. `Event.MESSAGE_SEND`全局事件触发 `_messageSendCallback`函数，函数内部的 `appendMessage`方法触发全局事件 `APPEND_MESSAGE`添加一条消息，此时 `_messageSendCallback`函数会异步调用ai接口函数去请求数据
3. `APPEND_MESSAGE`全局事件接收并触发 `_handleAppendMessage`函数，函数内部生成一个状态为 `thinking` 的消息对象，此时ai还在处理数据中，没有返回数据
4. `_handleAppendMessage`函数生成消息对象后，调用全局事件 `APPEND_MESSAGE_SUCCESS`，把状态为 `thinking` 的消息对象，传递出去
5. `chat`函数ai接口成功返回数据后，会执行回调函数 `_onResponseCallback`,把结果数据传递出去
6. 调用 `onResponse`函数，能拿到ai返回的回调数据
7. 调用 `updateMessage` 函数，触发全局事件 `UPDATE_MESSAGE` 更新一条数据
8. `UPDATE_MESSAGE`接收全局事件函数，触发 `_handleUpdateMessage` 函数，函数内部同时触发发送一个更新消息成功的全局事件
9. 拿到ai的数据并把之前状态为 `thinking`的消息对象合并，状态改为` done`,并覆盖 `msgList` 中旧的数据，并触发全局事件 `UPDATE_MESSAGE_SUCCESS` 更新消息成功事件，把最新的数据传递出去
10. `handleAppendMessageSuccess` 函数接收更新消息成功的全局事件
11. 最终，在页面上根据 `msgList` 列表进行渲染数据
