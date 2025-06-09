# CHIP-8 em TS
![image](https://github.com/user-attachments/assets/42148870-5bc0-4773-ac92-ed14af3a598f)

Olá, este é meu primeiro projeto de emulação. E tem duas coisas que o fazem especial para mim:

Primeiro, é que é um projeto não guiado; passei os últimos dias apenas pesquisando recursos e pensei em como seria a organização, também olhei projetos similares que já tinham começado e reaproveitei umas soluções. Está sendo muito interessante. 

O segundo motivo é que essa é minha introdução ao low-level. Esse é um mérito que fazer faculdade traz, indicar bons livros e ter um material didático. Algumas áreas de T.I. não têm um apelo midiático grande, ninguém vende curso de como virar programador de Kernel em apenas um mês, saindo do zero. 

Por fim, acredito que alguns torcerão o nariz para estar criando o projeto em TypeScript. A razão é que essa é minha zona de conforto no momento. Uma linguagem, pelo menos para mim, que não sou nem JR, é mais que apenas sintaxe, existe todo um ecossistema e forma de se pensar numa solução. Cogitei em escrevê-lo em C, isso me ajudaria com o exigido na faculdade, mas teria que aprender muitas coisas de C enquanto também aprendo muitas coisas sobre arquitetura e organização de computadores para emulação, não fazia muito sentido. Então lembrei do projeto de porte do TS para Go e não Rust, acho que nem sempre a melhor escolha é a com melhor técnica.

--
## AVISO!
Este repositório não será mais atualizado. Isto porque quando comecei este projeto, sabia poucas coisas sobre desenvolvimento, comparado com agora. Este projeto contém inúmeros erros de implementação e lógica, que causam bugs difíceis de serem rastreados. Mas é um projeto que tem importância pessoal por ser meu primeiro, por isso, não irei mais mexer nele. Entretanto, CHIP-8 se tornou um projeto muito especial para mim e continuarei a contribuir com a comunidade. O repositório: [chip-8-vite](https://github.com/vini-basilio/chip8-vite) contém a primiera versão totalmente estavel e aprovada pela suíte de testes Corax+ que você pode encontrar aqui: [testes](https://github.com/Timendus/chip8-test-suite/tree/main) com outras suítes. Além das documentações que cito no final deste README, acrescento a que acredito ser a melhor: [CHIP-8 Variant Opcode Table](https://chip8.gulrak.net/#quirk6). 

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
- ROM do print -> https://github.com/JohnEarnest/chip8Archive/tree/master/roms](https://github.com/Timendus/chip8-test-suite/blob/main/bin/1-chip8-logo.ch8

## Próximos passos
- No momento, tenho implementado apenas instruções do CHIP-8 original, mas colocarei todas suportadas pelo Octo.
- Também irei deixar algumas opções configuraveis, já que nem todas as implementações tinham o mesmo funcionamento de instrução.

## Conclusão

Durante a execução do projeto, propus um desafio a mim: acessar apenas blogs e ler a documentação. Meus objetivos com essa abordagem eram claros:

- Colocar em prática conhecimentos adquiridos na faculdade, já que "Arquitetura de computadores" é uma matéria completamente teórica.
- Ser capaz de implementar um projeto relativamente grande.
- Ser capaz de ler e aplicar documentação de baixo nível de abstração.

Esses objetivos foram todos alcançados, já que minha implementação conseguiu executar ROMs de teste.

A implementação era apenas parte do processo, o segundo estágio foi como comparar como desenvolvedores experientes solucionaram os mesmos problemas. 

Algumas coisas me chamaram atenção:

- Solução de IO:  já conhecia uma forma de solucionar IO, que foi ensinada aqui: [What is Memory Mapped I/O? 16-Bit VM in JavaScript 005](https://www.youtube.com/watch?v=hLYGTpvoMgE&list=PLP29wDx6QmW5DdwpdwHCRJsEubS5NrQ9b&index=5), entretanto, não consegui compreender como portá-la e acabei criando uma 
solução baseada em Mediator. Muito complexa e nada flexível. 
- Decodificação: segui de forma muito inflexível a ideia de que um opcode deve ser uma parte padrão da instrução, e quando me deparei com a falta de padrão do CHIP-8, tive dificuldades em adaptar meu código. Uma elegante solução para esta questão foi encontrada pela [engenheira de softwares Tania](https://www.taniarascia.com/writing-an-emulator-in-javascript-chip8/) 
- Execução: acreditei que dividir o código em procedures reduziria a complexidade por arquivo. No fim, apenas acrescentou complexidade e criou forte acoplamento dos módulos.

O balanço que faço sobre meus pontos a melhorar giram em torno da complexidade excessiva. Com a prática e leitura de código de outros desenvolvedores, acredito que essa questão tende a diminuir; especialmente acrescentando ao meu repertório de padrões de projeto.
