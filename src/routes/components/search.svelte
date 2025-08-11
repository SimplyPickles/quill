<div id="container"
     role="button"
     tabindex="-1"
     on:contextmenu|preventDefault
     on:mousedown|stopPropagation
     on:dragstart|preventDefault
>
    <img src="search.svg" alt="search">
    <input placeholder="search notes">
</div>

<style>
    #container {
        transition: 0.4s;
        position: relative;
 
        background: rgba(0, 0, 0, 0.04);
        color: rgba(0, 0, 0, 0.6);
        
        border: solid rgba(0, 0, 0, 0) .05em;
        
        width: calc(100% - 16px);
        height: calc(24px + .5vw);

        margin-left: 8px;
        margin-bottom: 4px;
        margin-top: 26px;

        border-radius: 9px;
    }

    #container:hover {
        background: rgba(0, 0, 0, 0.06);
    }
    
    input {
        position: absolute;
        
        background: none;
        color: var(--text-color);
        opacity: 0.5;
        border: none;
        
        text-align: left;
        font-size: 0.8em;
        
        left: 24px;
        top: -1px;
        
        width: calc(100% - 42px);
        height: inherit;
    }

    input:focus {
        outline: none;
    }

    input::placeholder {
        color: var(--text-color);
        opacity: 0.5;
    }

    img {
        position: absolute;
        
        left: 7px;
        top: 7.5px;

        opacity: 0.2;
        
        width: 14px;
        height: 14px;
    }
</style>