import localStorage from "@react-native-async-storage/async-storage"
import Axios from 'axios'
export const localhost = "http://localhost"
export const localhost1 = "http://localhost"
Axios.defaults.headers.post["Content-Type"] = "multipart/form-data"
const setToken = (async () => { const token = await localStorage.getItem("token"); if (token) Axios.defaults.headers.common["Authorization"] = token; })()
function _axios() {
   (async () => {
      const ok = 200 || 201
      this.get = async (url) => { let response = await Axios.get(url); const setToken = (async () => { const token = await localStorage.getItem("token"); if (token) Axios.defaults.headers.common["Authorization"] = token; })() ;return { data: response.data, status: response.status };  }
      this.post = async (url, data) => { const dt = new FormData(); for (let i in data) { dt.append(String(i), data[i]) }; let response = await Axios.post(url, dt); return { data: response.data, status: response.status } }
      this.put = async (url, data) => { const dt = new FormData(); for (let i in data) { dt.append(String(i), data[i]) }; let response = await Axios.put(url, dt); return { data: response.data, status: response.status } }
      this.delete = async (url) => { try { let response = await Axios.delete(url); return { data: response.data, status: response.status } } catch (err) { console.log(err) } }
   })()
}
export const axios = new _axios()