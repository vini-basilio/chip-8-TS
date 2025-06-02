export const RegisterElement = (state: string[]) => {
    return `
    <aside>
      <h3>REGISTERS STATE</h3>
      <main  style=" display: flex;
            gap: 20px;
            justify-items: center;
            align-content: space-evenly;
"
      >
         <div>
          <p>${state[0]} </p>
          <p>${state[1]} </p>
          <p>${state[2]} </p>
          <p>${state[3]} </p>
          <p>${state[4]} </p>
        </div>
        <div>
          <p> ${state[5]} </p>
          <p> ${state[6]} </p>
          <p> ${state[7]} </p>
          <p> ${state[8]} </p>
          <p> ${state[9]} </p>
        </div>
        <div>
          <p> ${state[10]} </p>
          <p> ${state[11]} </p>
          <p> ${state[12]} </p>
          <p> ${state[13]} </p>
          <p> ${state[14]} </p>
        </div>
        <div>
          <p> ${state[15]} </p>
          <p>${state[16]} </p>
          <p>${state[17]} </p>
          <p>${state[18]} </p>
        </div>
      </main>
    </aside>
    `
}