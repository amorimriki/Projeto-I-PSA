def substituir_resultados(lista):
    return ['Pass' if item == 1 else 'Fail' if item == 0 else item for item in lista]