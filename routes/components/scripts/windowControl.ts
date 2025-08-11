import { getCurrentWindow, LogicalSize, type Window } from "@tauri-apps/api/window";
import { register } from "@tauri-apps/plugin-global-shortcut";

export async function setupWindowControls(drag: HTMLDivElement): Promise<void> {
    // drag behavior
    drag.addEventListener("mousedown", (event: MouseEvent) => {
        event.preventDefault();
        getCurrentWindow().startDragging();
    });

    // close manager
    const tauriWindow: Window = getCurrentWindow();
    tauriWindow.listen("tauri://close-requested", async (event) => {
        tauriWindow.hide();
    });

    // toggling window visibility
    let canToggle: boolean = true;
    try {
        await register("Alt+Q", async () => {
            if (!canToggle) return;
            canToggle = false;
            setTimeout(() => {
                canToggle = true;
            }, 140);

            if (await tauriWindow.isVisible()) {
                await tauriWindow.hide();
            } else {
                await tauriWindow.show();
                await tauriWindow.setFocus();
            }
        });
    } catch (err) {
        console.log("bind already registered");
    }
}