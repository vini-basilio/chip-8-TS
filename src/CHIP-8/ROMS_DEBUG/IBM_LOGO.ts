export const IBM_LOGO = [
    0x00E0,
    0xA00,
    0x6000,
    0x6100,
    0xD015,
    0x7004,
    0x7104,
    0x1206,

]

export const TEST_SPRITE_PROGRAM = [
    0x00E0, // CLS: Limpa a tela
    0xA000, // LDI 0x2F0: Carrega o endereço 0x2F0 no registrador I (onde o sprite estará)
    0x600A, // LDV0 0x0A: Coloca o valor 0x0A (10 em decimal) no registrador V0 (coordenada X do sprite)
    0x610A, // LDV1 0x0A: Coloca o valor 0x0A (10 em decimal) no registrador V1 (coordenada Y do sprite)
    0xD015, // DRWV0V1 0x05: Desenha o sprite em (V0, V1) com 5 bytes de altura. O sprite é o que está em I.
    0x120A, // JUMP 0x20A: Salta para o endereço 0x20A (onde está o próprio JUMP), criando um loop infinito.
];


export const DRAW_E_CENTER = [
    0x00E0,             // CLS: Limpa a tela
    0xA000,             // LDI 0x2F0: Carrega o endereço 0x000 no registrador I (onde o sprite "E" estará)
    0x602C,             // LDV0 0x2C: Carrega 0x2C (44 em decimal) no registrador V0 (X = 64 / 2 - 8/2 = 32 - 4 = 44)
    0x610F,             // LDV1 0x0F: Carrega 0x0F (15 em decimal) no registrador V1 (Y = 32 / 2 - 5/2 = 16 - 2 = 15)
    0xD015,             // DRWV0V1 0x05: Desenha o sprite em (V0, V1) com 5 bytes de altura.
    0x120A,             // JUMP 0x20A: Loop infinito para manter o 'E' na tela
];