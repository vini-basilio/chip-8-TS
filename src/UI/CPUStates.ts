export const CPUStates = (title: string, state: string[]) => {
    const elements = state.map(n => `<tr><td>${n}</td></tr>`).join("")
    return `
    <aside>
      <main style=
      " 
            display: flex;
            flex-direction: column;
            justify-items: center;
            align-content: cennter;
            text-align: center;
        "          
      >
        <h2>${title}</h2>
            <table>
                <tbody>
                    ${elements}
                </tbody>
            </table>
      </main>
    </aside>
    `
}
