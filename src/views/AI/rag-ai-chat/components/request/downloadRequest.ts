
/**
 * 下载参考资料
 * @param data 包含 dataset_id 和 document_id 的对象
 */
export async function referenceDownloadRequest(data: { dataset_id: string; document_id: string; document_name: string }) {
  try {
    const { dataset_id, document_id, document_name } = data;
    const url = `${import.meta.env.VITE_RAGFOLW_URL}/datasets/${dataset_id}/documents/${document_id}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_RAGFOLW_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`下载失败: ${response.status} ${response.statusText}`);
    }

    // 创建 blob 对象并下载
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = document_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return { success: true, document_name };
  } catch (error) {
    console.error('下载文档失败:', error);
    throw error;
  }
}