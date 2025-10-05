<template>
  <div class="question-add">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>添加题目</span>
          <el-button type="text" @click="goBack">返回</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="题目内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入题目内容"
          />
        </el-form-item>

        <el-form-item label="题目类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择题目类型">
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
            <el-option label="判断题" value="judge" />
          </el-select>
        </el-form-item>

        <el-form-item label="难度" prop="difficulty">
          <el-select v-model="form.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-input
            v-model="form.category"
            placeholder="请输入分类，如：JavaScript"
          />
        </el-form-item>

        <el-form-item label="选项" prop="options">
          <div
            v-for="(option, index) in form.options"
            :key="index"
            style="margin-bottom: 10px"
          >
            <el-input
              v-model="form.options[index]"
              :placeholder="`选项 ${String.fromCharCode(65 + index)}`"
            >
              <template #append>
                <el-button
                  @click="removeOption(index)"
                  :disabled="form.options.length <= 2"
                  >删除</el-button
                >
              </template>
            </el-input>
          </div>
          <el-button @click="addOption" type="primary" plain
            >添加选项</el-button
          >
        </el-form-item>

        <el-form-item label="正确答案" prop="correctAnswer">
          <el-input
            v-model="form.correctAnswer"
            placeholder="请输入正确答案，如：A 或 AB"
          />
        </el-form-item>

        <el-form-item label="答案解析" prop="explanation">
          <el-input
            v-model="form.explanation"
            type="textarea"
            :rows="3"
            placeholder="请输入答案解析"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading"
            >提交</el-button
          >
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { createQuestion } from "@/api/questions";

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive({
  content: "",
  type: "single",
  difficulty: "medium",
  category: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  explanation: "",
});

const rules: FormRules = {
  content: [{ required: true, message: "请输入题目内容", trigger: "blur" }],
  type: [{ required: true, message: "请选择题目类型", trigger: "change" }],
  difficulty: [{ required: true, message: "请选择难度", trigger: "change" }],
  category: [{ required: true, message: "请输入分类", trigger: "blur" }],
  correctAnswer: [
    { required: true, message: "请输入正确答案", trigger: "blur" },
  ],
};

const addOption = () => {
  form.options.push("");
};

const removeOption = (index: number) => {
  if (form.options.length > 2) {
    form.options.splice(index, 1);
  }
};

const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await createQuestion(form);
        ElMessage.success("添加成功");
        router.push("/questions");
      } catch (error) {
        ElMessage.error("添加失败");
      } finally {
        loading.value = false;
      }
    }
  });
};

const resetForm = () => {
  formRef.value?.resetFields();
  form.options = ["", "", "", ""];
};

const goBack = () => {
  router.back();
};
</script>

<style scoped lang="scss">
.question-add {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
