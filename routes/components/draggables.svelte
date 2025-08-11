<!-- VerticalDragGrid.svelte -->
<script>
  import { onMount } from 'svelte';
  import Muuri from 'muuri';

  let gridContainer;

  onMount(() => {
    new Muuri(gridContainer, {
      dragEnabled: true,
      layout: {
        fillGaps: false,
        horizontal: false
      },
      dragSort: function () {
        return [this];
      },
      dragAxis: 'y'
    });
  });
</script>

<style>
  .scroll-box {
    width: 300px;
    height: 400px;
    overflow-y: auto;
    border: 1px solid #ccc;
    margin: 40px auto;
    background: #fafafa;
  }
  .grid {
    /* Remove flex and gap, Muuri handles layout */
    position: relative;
    padding: 8px;
  }
  .item {
    background: #fff;
    border: 1px solid #aaa;
    cursor: grab;
    user-select: none;
    position: absolute; /* Muuri will set top/left */
    width: 100%;
    box-sizing: border-box;
  }
  .muuri-item-content {
    padding: 16px;
  }
</style>

<div class="scroll-box">
  <div class="grid" bind:this={gridContainer}>
    <div class="item"><div class="muuri-item-content">Item 1</div></div>
    <div class="item"><div class="muuri-item-content">Item 2</div></div>
    <div class="item"><div class="muuri-item-content">Item 3</div></div>
    <div class="item"><div class="muuri-item-content">Item 4</div></div>
    <div class="item"><div class="muuri-item-content">Item 5</div></div>
  </div>
</div>