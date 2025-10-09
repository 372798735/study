import request from "./request";

// 字典类型
export interface Dictionary {
  id: number;
  type: string;
  label: string;
  value: string;
  sort: number;
  status: string;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

// 字典表单
export interface DictionaryForm {
  type: string;
  label: string;
  value: string;
  sort?: number;
  status?: string;
  remark?: string;
}

// 获取字典列表
export function getDictionaries(params?: { type?: string; status?: string }) {
  return request.get("/dictionary", { params });
}

// 按类型获取字典（用于下拉框）
export function getDictionaryByType(type: string) {
  return request.get(`/dictionary/type/${type}`);
}

// 获取字典详情
export function getDictionary(id: number) {
  return request.get(`/dictionary/${id}`);
}

// 创建字典
export function createDictionary(data: DictionaryForm) {
  return request.post("/dictionary", data);
}

// 更新字典
export function updateDictionary(id: number, data: Partial<DictionaryForm>) {
  return request.put(`/dictionary/${id}`, data);
}

// 删除字典
export function deleteDictionary(id: number) {
  return request.delete(`/dictionary/${id}`);
}

// 批量删除字典
export function batchDeleteDictionaries(ids: number[]) {
  return request.delete("/dictionary/batch/delete", { data: { ids } });
}
