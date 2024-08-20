<script lang="ts">
  import { type Route, router } from '@/core/router'
  import { openPage } from '@nanostores/router'

  let onMethodTypeBtnClick = (type: Route) => () => {
    openPage(router, type)
  }
</script>

<main>
  <div class="method-select-outer">
    <article>
      <div class="method-select-inner">
        <button class="button" on:click={onMethodTypeBtnClick('loadHistory')}
          >add payment history file</button
        >
        <button class="button secondary" on:click={onMethodTypeBtnClick('transactionForm')}
          >add payment sum</button
        >
        <button
          class="button contrast"
          on:click={onMethodTypeBtnClick('transactionsHistory')}
          >all transactions</button
        >
      </div>
    </article>
  </div>
</main>

<style module>
  .method-select-outer {
    max-width: 500px;
    margin: 0 auto;
  }
  .method-select-inner {
    height: 600px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: stretch;
  }

  .button {
    text-transform: uppercase;
    margin-bottom: 0.4em;
  }

  .button:last-child {
    margin-bottom: 0;
  }
</style>
