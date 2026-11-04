<script setup lang="ts">
const { t, locale } = useI18n()
const source = ref(locale.value === 'zh' ? '姓名,角色,城市\n阿达,工程师,伦敦\n格蕾丝,海军上将,纽约\n林纳斯,工程师,赫尔辛基' : 'name,role,city\nAda,Engineer,London\nGrace,Admiral,New York\nLinus,Engineer,Helsinki')
const fileName = ref('')
const query = ref('')
const sortColumn = ref(-1)
const sortDirection = ref<1 | -1>(1)

const table = computed(() => parseCsv(source.value).filter(row => row.some(cell => cell !== '')))
const headers = computed(() => table.value[0] ?? [])
const body = computed(() => table.value.slice(1))

const rows = computed(() => {
  const search = query.value.trim().toLowerCase()
  let result = body.value.filter(row => !search || row.some(cell => cell.toLowerCase().includes(search)))
  if (sortColumn.value >= 0) {
    result = [...result].sort((a, b) => {
      const left = a[sortColumn.value] ?? ''
      const right = b[sortColumn.value] ?? ''
      const leftNumber = Number(left)
      const rightNumber = Number(right)
      const compare = left !== '' && right !== '' && Number.isFinite(leftNumber) && Number.isFinite(rightNumber)
        ? leftNumber - rightNumber
        : left.localeCompare(right, undefined, { numeric: true })
      return compare * sortDirection.value
    })
  }
  return result
})

function sort(index: number) {
  if (sortColumn.value === index) sortDirection.value = sortDirection.value === 1 ? -1 : 1
  else {
    sortColumn.value = index
    sortDirection.value = 1
  }
}

async function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  source.value = await file.text()
  fileName.value = file.name
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <input type="file" accept=".csv,text/csv" @change="onFile" />
      <InputText v-model="query" size="small" :placeholder="t('ui.searchRows')" />
      <span v-if="fileName" class="tool-hint">{{ fileName }}</span>
    </div>
    <Textarea v-model="source" class="tool-textarea" rows="5" placeholder="Or paste CSV here…" />
    <div class="tool-actions">
      <span class="tool-hint">{{ t('ui.csvStats', { shown: rows.length, total: body.length, columns: headers.length }) }}</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in headers" :key="index" @click="sort(index)">
              {{ header || t('ui.column', { n: index + 1 }) }}
              <span v-if="sortColumn === index">{{ sortDirection === 1 ? '↑' : '↓' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows.slice(0, 500)" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="rows.length > 500" class="tool-hint">{{ t('ui.csvLimit') }}</p>
    </div>
    <p v-if="!rows.length" class="tool-hint">{{ t('ui.noMatches') }}</p>
    <p class="tool-hint">{{ t('ui.csvHint') }}</p>
  </div>
</template>

<style scoped>
.table-wrap {
  max-height: 60vh;
  overflow: auto;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
}

th {
  position: sticky;
  top: 0;
  background: var(--p-content-background, #fff);
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
}

th,
td {
  padding: 0.45rem 0.65rem;
  border-bottom: 1px solid color-mix(in srgb, var(--p-text-color) 8%, transparent);
}

@media (prefers-color-scheme: dark) {
  th {
    background: #18181b;
  }
}
</style>
