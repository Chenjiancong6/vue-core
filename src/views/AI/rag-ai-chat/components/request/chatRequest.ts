
/**
 * 调用ragflow接口，获取ai模型回复
 */
export const ragflow_chat_request = async (body: any, method = 'POST')  => {
  const response = await fetch('/ragflow/chat/completions', {
    method,
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_RAGFOLW_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  return data;
}
