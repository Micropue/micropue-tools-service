<script setup lang="ts">
const name = ref('')
const submitted = ref(false)
const rows = ref([
  { id: 1, name: 'Alpha', status: 'Active' },
  { id: 2, name: 'Beta', status: 'Pending' },
  { id: 3, name: 'Gamma', status: 'Active' }
])
</script>

<template>
  <div class="page">
    <Card>
      <template #title>PrimeVue 4 + Nuxt</template>
      <template #content>
        <p class="mb">组件已自动注册，主题为黑白 Noir。</p>

        <div class="row">
          <InputText v-model="name" placeholder="输入名字" />
          <Button label="提交" icon="pi pi-check" @click="submitted = true" />
        </div>

        <p v-if="submitted" class="mb">
          <Tag severity="success" value="已提交" /> {{ name || '（空）' }}
        </p>

        <DataTable :value="rows" size="small">
          <Column field="id" header="ID" />
          <Column field="name" header="Name" />
          <Column field="status" header="Status" />
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.page {
  padding: 3rem;
  max-width: 720px;
  margin: 0 auto;
}

.mb {
  margin-bottom: 1rem;
}

.row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: center;
}
</style>
