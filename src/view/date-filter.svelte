<script lang="ts">
  import Flatpickr from 'svelte-flatpickr'
  import 'flatpickr/dist/flatpickr.css'
  import { startDateFilter, endDateFilter } from '@/core/transactions/store'
  import { convertDateToCompare } from '@core/helpers/date'

  let startDate: Date | null = $startDateFilter
  let endDate: Date | null = $endDateFilter

  function updateStartDate(selectedDate: Date | null) {
    const [selectedDates, dateStr] = selectedDate.detail
    console.log({ selectedDates, dateStr })
    startDateFilter.set(convertDateToCompare(dateStr))
  }

  function updateEndDate(selectedDate: Date | null) {
    const [selectedDates, dateStr] = selectedDate.detail
    endDateFilter.set(convertDateToCompare(dateStr))
  }
</script>

<div>
  <label>Start Date:</label>
  <Flatpickr
    options={{ dateFormat: 'd.m.Y' }}
    placeholder="Select start date"
    bind:value={startDate}
    on:change={updateStartDate}
  />

  <label>End Date:</label>
  <Flatpickr
    options={{ dateFormat: 'd.m.Y' }}
    placeholder="Select end date"
    bind:value={endDate}
    on:change={updateEndDate}
  />
</div>
