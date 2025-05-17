import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';

export default {
  /**
   * 获取所有项目文件列表
   */
  async getFilesList() {
    try {
      const response = await axios.get(`${API_URL}/api/files/list`);
      return response.data;
    } catch (error) {
      console.error('获取文件列表失败:', error);
      throw error;
    }
  },

  /**
   * 获取文件内容
   * @param {string} filename 文件名
   */
  async getFileContent(filename) {
    try {
      const response = await axios.get(`${API_URL}/api/files/content/${filename}`);
      return response.data;
    } catch (error) {
      console.error('获取文件内容失败:', error);
      throw error;
    }
  },

  /**
   * 上传文件
   * @param {File} file 文件对象
   */
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/api/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('上传文件失败:', error);
      throw error;
    }
  },

  /**
   * 删除文件
   * @param {string} filename 文件名
   */
  async deleteFile(filename) {
    try {
      const response = await axios.delete(`${API_URL}/api/files/delete/${filename}`);
      return response.data;
    } catch (error) {
      console.error('删除文件失败:', error);
      throw error;
    }
  }
}; 