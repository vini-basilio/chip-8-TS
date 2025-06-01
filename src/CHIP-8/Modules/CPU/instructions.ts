export const  INSTRUCTIONS  = {
    CLEAR_SCREEN: 0x00E0,
    JUMP: 0x1,                      // NNN
    MOV_LIT_REG:  0x6,              // XNN -> feito
    ADD_LIT_TO_REGISTER: 0x7,       // XNN -> feito
    SET_INDEX_REGISTER: 0xA,        // NNN -> feito
    DRAW: 0xD,                      // XYN -> com bug
    // Pular de forma condicional
}

/*


 Vi uns blogs bem legais, e esse achei o mais informativo: https://tobiasvl.github.io/blog/write-a-chip-8-emulator/. Tambem foi de onde copiei o texto sobre as instrucoes


    X: The second nibble. Used to look up one of the 16 registers (VX) from V0 through VF.
    Y: The third nibble. Also used to look up one of the 16 registers (VY) from V0 through VF.
    N: The fourth nibble. A 4-bit number.
    NN: The second byte (third and fourth nibbles). An 8-bit immediate number.
    NNN: The second, third and fourth nibbles. A 12-bit immediate memory address.

    Todas instrucoes
    https://github.com/trapexit/chip-8_documentation
    https://www.cs.columbia.edu/~sedwards/classes/2016/4840-spring/designs/Chip8.pdf
*/