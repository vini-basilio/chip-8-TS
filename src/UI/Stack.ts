export const StackElement = (state: string[]) => {
    const elements = state.map(n=>  `<tr><td>${n}</td> </tr>`)
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
      <h3></h3>
       <table
    >

      <tr
       style = "
                width: 100%;
                border-collapse: collapse;"
                 border: 1px solid;
      >
        <th>STACK</th>
      </tr>
      ${elements}
    </table>
      </main>
    </aside>
    `
}