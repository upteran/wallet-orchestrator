<script lang="ts">
  import { type Atom } from 'nanostores'
  import Flatpickr from 'svelte-flatpickr'
  import 'flatpickr/dist/flatpickr.css'
  import { startDateFilter, endDateFilter } from '@/core/transactions/store'
  import { convertDateToCompare } from '@core/helpers/date'

  let startDate: Date | null = null
  let endDate: Date | null = null

  function updateDate(event: CustomEvent<unknown>, date: Atom<unknown>) {
    const [, dateStr] = event.detail as [unknown, string]
    date.set(dateStr ? convertDateToCompare(dateStr) : null)
  }

  function updateStartDate(event: CustomEvent<unknown>) {
    updateDate(event, startDateFilter)
  }

  function updateEndDate(event: CustomEvent<unknown>) {
    updateDate(event, endDateFilter)
  }
  function clearFilters() {
    startDateFilter.set(null)
    endDateFilter.set(null)
  }
  $: startDate = $startDateFilter?.toDate() || null
  $: endDate = $endDateFilter?.toDate() || null
</script>

<div>
  <div>Start Date:</div>
  <Flatpickr
    options={{ dateFormat: 'd.m.Y' }}
    placeholder="Select start date"
    bind:value={startDate}
    on:change={updateStartDate}
  />

  <div>End Date:</div>
  <Flatpickr
    options={{ dateFormat: 'd.m.Y' }}
    placeholder="Select end date"
    bind:value={endDate}
    on:change={updateEndDate}
  />
</div>
<button class="outline" on:click={clearFilters}>Clear filters</button>
