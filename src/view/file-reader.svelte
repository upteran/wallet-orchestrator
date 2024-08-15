<script lang="ts">
  import { parseCSV } from './../core/file-parser'

  const csvTypes = [
    { value: 'csv1', label: 'CSV 1' },
    { value: 'csv2', label: 'CSV 2' },
    // Add other CSV types here
  ]

  let selectedCsvType: string | undefined = undefined

  const handleFileUpload = (event: Event): void => {
    if (!selectedCsvType) {
      alert('Please select a CSV type.')
      return
    }

    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = function (e: ProgressEvent<FileReader>): void {
        if (e.target) {
          const csvContent = e.target.result as string
          // Use the generalized parser
          parseCSV(csvContent, selectedCsvType!)
        }
      }

      reader.readAsText(file)
    }
  }
</script>

<select required bind:value={selectedCsvType}>
  <option disabled value="">Select CSV type</option>
  {#each csvTypes as type}
    <option value={type.value}>{type.label}</option>
  {/each}
</select>

<input accept=".csv" type="file" on:change={handleFileUpload} />
