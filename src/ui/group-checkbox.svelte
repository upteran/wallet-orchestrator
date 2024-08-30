<script lang="ts">
  export let toggler: boolean;
  export let clickHandler: () => void;

  const handleClick = () => {
    clickHandler();
  };
</script>

<label>
  <input type="checkbox" bind:checked={toggler} on:change={handleClick} />
  Group by Transaction Name
</label>
