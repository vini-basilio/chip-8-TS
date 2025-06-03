export const  INSTRUCTIONS  = {
    JUMP: 0x1,                      // NNN                              -> feito
    JUMP_OFFSET: 0xB,               // NNN                              -> feito
    // Tela
    CLEAR_SCREEN: 0x00E0,           //                                  -> feito
    DRAW: 0xD,                      // XYN                              -> feito
    // Geral
    RANDOM: 0xC,                    // XNN                              ->
    MOV_LIT_REG:  0x6,              // XNN                              -> feito
    ADD_LIT_TO_REGISTER: 0x7,       // XNN                              -> feito
    SET_INDEX_REGISTER: 0xA,        // NNN                              -> feito
    // Subroutines
    CALL_SUB: 0x2,                   // NNN Pula para uma subrotina     -> feito
    CALL_RET: 0x00EE,                // retorna de uma subrotina        -> feito
    // JUMPS condicionais
    // Pulam dois bytes. Ou seja, sao blocos de IF
    EQUALS: 0x5,                     // XY0 onde X e igual a Y          -> feito
    NOT_EQUALS: 0x9,                 // XY0 onde X nao e igual a Y      -> feito
    EQUALS_LIT: 0x3,                 // XNN onde X e igual a NN         -> feito
    NOT_EQUAL_LIT: 0x4,              // XNN onde X nao e igual a NN     -> feito
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