export const CreateMemory = (sizeBytes: number) => {
    const memory = new ArrayBuffer(sizeBytes);
    const dv = new DataView(memory)
    return dv
}