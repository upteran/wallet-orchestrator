<script lang="ts">
  import {
    categories,
    filterByCategory,
    activeCategoryFilter
  } from '@core/transactions/store'
  import { type TransactionsCategory } from '@core/transactions/category'

  const onCategoryClick = (name: TransactionsCategory) => () => {
    filterByCategory(name)
  }
  const onClearCategoryClick = () => {
    filterByCategory(null)
  }
</script>

<div class="category-list">
  {#each $categories as category (category.id)}
    <button
      class="outline {$activeCategoryFilter === category.name
        ? 'contrast'
        : ''}"
      on:click={onCategoryClick(category.name)}
    >
      {category.name}
    </button>
  {/each}
  <button on:click={onClearCategoryClick}>clear</button>
</div>

<style>
  .category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
</style>
