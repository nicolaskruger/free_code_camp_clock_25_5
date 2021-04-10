import {timerToString, timerDecress} from './index';

describe('deve validar as operações lógicas para o projeto',()=>{
    it('deve converter para string corretaemnte',()=>{
        expect(timerToString({mm:0,ss:0}))
            .toBe("00:00")
    })
    it('deve decrementar corretamente o valor do contado',()=>{
        expect(timerDecress({mm:1,ss:0}))
            .toEqual({mm:0,ss:59})
        expect(timerDecress({mm:1,ss:1}))
            .toEqual({mm:1,ss:0})
    })
})