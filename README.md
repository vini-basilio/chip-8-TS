# CHIP-8 em TS
![image](https://github.com/user-attachments/assets/42148870-5bc0-4773-ac92-ed14af3a598f)

Olá, este é meu primeiro projeto de emulação. E tem duas coisas que o fazem especial para mim:

Primeiro, é que é um projeto não guiado; passei os últimos dias apenas pesquisando recursos e pensei em como seria a organização, também olhei projetos similares que já tinham começado e reaproveitei umas soluções. Está sendo muito interessante. 

O segundo motivo é que essa é minha introdução ao low-level. Esse é um mérito que fazer faculdade traz, indicar bons livros e ter um material didático. Algumas áreas de T.I. não têm um apelo midiático grande, ninguém vende curso de como virar programador de Kernel em apenas um mês, saindo do zero. 

Por fim, acredito que alguns torcerão o nariz para estar criando o projeto em TypeScript. A razão é que essa é minha zona de conforto no momento. Uma linguagem, pelo menos para mim, que não sou nem JR, é mais que apenas sintaxe, existe todo um ecossistema e forma de se pensar numa solução. Cogitei em escrevê-lo em C, isso me ajudaria com o exigido na faculdade, mas teria que aprender muitas coisas de C enquanto também aprendo muitas coisas sobre arquitetura e organização de computadores para emulação, não fazia muito sentido. Então lembrei do projeto de porte do TS para Go e não Rust, acho que nem sempre a melhor escolha é a com melhor técnica.

---
## Como funciona a extração das instruções
Sem muito segredo, são apenas operações de bitwise. Todas as instruções serão listadas num arquivo a parte e checadas com switch/case.
```ts
 const decode = (instruction: number) => {
            return (instruction & 0xF000) >> 12;
        }

        const opcode = decode(instruction);

        switch(opcode){
            case INSTRUCTIONS.MOV_LIT_REG:{
                const register = (instruction & 0x0F00) >> 8;
                const literal =  (instruction & 0x00FF)
                this.setRegisterByInstruction(register, literal);
                break;
            }
```
## Como funciona a tela
No momento, é uma classe que cuida de desenhar no elemento Canvas do HTML. Como o CHIP-8 tinha uma "vram", decidi, neste primeiro momento, apenas criar um ArrayBuffer como o estado de cada pixel. Podemos usar as técnicas bem conhecidas do C aqui, evitando um inner loop: 
```ts
  getPixel(row: number, col: number){
        return  this.vram.getUint8(row * this.columns + col);
  }
    setPixel(row: number, col: number, state: number){
        this.vram.setUint8(row * this.columns + col, state)
  }

  // some code
  for(let index = 0; index < this.rows * this.columns ; index++)
```
## Como funciona a execução
Enquanto escrevo, tenho apenas o conjunto mínimo de instruções para testar o emulador. Sendo assim, ele ainda não é capaz de executar de forma automática. Isso também ajuda a não ler passo-a-passo. Use o botão na tela para ir para a próxima instrução.

## Sobre a ROM
Você pode baixar uma cópia dela nos recursos listados abaixo.

## Recursos
Segue a lista dos recursos utilizados até o momento:
- https://tobiasvl.github.io/blog/write-a-chip-8-emulator/
- https://github.com/trapexit/chip-8_documentation
- https://www.cs.columbia.edu/~sedwards/classes/2016/4840-spring/designs/Chip8.pdf
- https://www.youtube.com/@LowByteProductions
- Apostilas da faculdade
- ROM do Logo da IBM e suite de testes -> [rom](https://github.com/JohnEarnest/chip8Archive/tree/master/roms)

## Próximos passos
- No momento, tenho implementado apenas instruções do CHIP-8 original, mas colocarei todas suportadas pelo Octo.
- Também irei deixar algumas opções configuraveis, já que nem todas as implementações tinham o mesmo funcionamento de instrução.

## O que penso que poderia melhorar
Agora que terminei todo o conjunto de instruções do CHIP-8 original, comecei a buscar como outros desenvolvedores implementaram. Queria entender como programadores experientes resolveram os problemas que encontrei. Duas coisas me chamaram atenção. A primeia foi a solução de IO, apesar de já ter visto a solução aqui: [What is Memory Mapped I/O? 16-Bit VM in JavaScript 005](https://www.youtube.com/watch?v=hLYGTpvoMgE&list=PLP29wDx6QmW5DdwpdwHCRJsEubS5NrQ9b&index=5), não havia compreendido bem como portar esse código e acabei introduzindo muita complexidade. Também vejo como a própria CPU poderia ser mais eficiente. Quando comecei, este projeto, tinha pausado a série listada anteriormente, e comecei pensando em como portar. Acreditava que era uma abordagem muito robusta, e de fato era, até demais. Também pensei que usar uma abstração do control unit e funcões fosse melhor que apenas colocar tudo numa única classe; outro ponto que hoje faria diferente. Por fim, a abordagem da [engenheira de softwares Tania](https://www.taniarascia.com/writing-an-emulator-in-javascript-chip8/) sobre o problema do opcode não padronizado é extremamente elegante e resolve os edge cases que tive de forma simples. 


