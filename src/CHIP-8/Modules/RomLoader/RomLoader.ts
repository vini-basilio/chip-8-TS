import {RomLoaderInterface} from "../../Interfaces/Contracts";

export class RomLoader implements RomLoaderInterface{
    LoaderListener(
        input: HTMLInputElement,
        output: HTMLElement,
        loadRom: (arr: Uint8Array) => void)
        {
        input.addEventListener('change', function(e: Event) {
            if(e.target == null) return;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const file = e.target.files[0];

            if (!file) return;
            const reader = new FileReader();

            reader.onload = function(event) {
                const rom = new Uint8Array(event.target!.result  as ArrayBuffer);
                loadRom(rom)
                console.log("Rodei")
                output.innerHTML = `
                            <h3>ROM loaded: ${file.name}</h3>
                            <p>Size: ${rom.length} bytes</p>
                            <p>Initial bytes: ${Array.from(rom.slice(0, 16)).map(b => `0x${b.toString(16).padStart(2, '0')}`).join(' ')}</p>
                        `;
                return rom
            };
            reader.readAsArrayBuffer(file);
        });
    }
}