<script lang="ts">
    import "../app.css";

    import Editor from "./components/editor/editor.svelte";
    import Sidebar from "./components/sidebar.svelte";
</script>

<main>
    <Sidebar></Sidebar>
    <Editor></Editor>
    <div id="drag"></div>
</main>

<style>
    main {
        overflow-x: hidden;
        --sidebar-width: calc(6vw + 120px);
    }
</style>
