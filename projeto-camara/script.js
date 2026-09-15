const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
]

const diasSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
]


const funcionarioInput = document.getElementById("funcionario")
const cargoInput = document.getElementById("cargo")
const mesInput = document.getElementById("mes")
const anoInput = document.getElementById("ano")

const nomeExibicao = document.getElementById("nomeExibicao")
const cargoExibicao = document.getElementById("cargoExibicao")
const referenciaExibicao = document.getElementById("referenciaExibicao")
const corpoTabela = document.getElementById("corpoTabela")
const mensagem = document.getElementById("mensagem")

let tabelaEmEdicao = false


function mostrarMensagem(texto, tipo = "erro") {
    mensagem.textContent = texto
    mensagem.className = "mensagem " + tipo
}


function gerarFrequencia() {
    const funcionario = funcionarioInput.value.trim()
    const cargo = cargoInput.value.trim()
    const mes = Number(mesInput.value)
    const ano = Number(anoInput.value)

    if (funcionario === "") {
        mostrarMensagem("Digite o nome do funcionário.")
        funcionarioInput.focus()
        return
    }

    if (cargo === "") {
        mostrarMensagem("Digite o cargo do funcionário.")
        cargoInput.focus()
        return
    }

    if (mes < 1 || mes > 12) {
        mostrarMensagem("Selecione um mês.")
        mesInput.focus()
        return
    }

    if (ano < 1900 || ano > 2100) {
        mostrarMensagem("Digite um ano válido entre 1900 e 2100.")
        anoInput.focus()
        return
    }

    const quantidadeDias = new Date(ano, mes, 0).getDate()

    nomeExibicao.textContent = funcionario.toUpperCase()
    cargoExibicao.textContent = cargo.toUpperCase()

    referenciaExibicao.textContent =
        String(mes).padStart(2, "0") + "/" + ano

    corpoTabela.innerHTML = ""

    tabelaEmEdicao = false

    const botaoEditar = document.querySelector(".botao.editar")
    botaoEditar.textContent = "Editar tabela"


    for (let dia = 1; dia <= quantidadeDias; dia++) {

        const data = new Date(ano, mes - 1, dia)
        const diaSemana = data.getDay()

        const dataFormatada =
            String(dia).padStart(2, "0") +
            "/" +
            String(mes).padStart(2, "0") +
            "/" +
            ano

        const nomeDia = diasSemana[diaSemana]

        let entrada = "08:00"
        let saidaManha = "12:00"
        let inicioTarde = "13:00"
        let saidaTarde = "17:00"
        let observacao = ""

        const fimDeSemana =
            diaSemana === 0 || diaSemana === 6


        if (diaSemana === 2) {
            saidaTarde = "21:00"
        }


        if (fimDeSemana) {
            entrada = ""
            saidaManha = ""
            inicioTarde = ""
            saidaTarde = ""

            observacao = ""
        }


        const linha = document.createElement("tr")

        if (fimDeSemana) {
            linha.classList.add("fim-de-semana")
        }


        linha.innerHTML = `
            <td>${dia}</td>

            <td>${dataFormatada}</td>

            <td>${nomeDia}</td>

            <td>
                <input
                    type="time"
                    class="campo-editavel"
                    value="${entrada}"
                    disabled
                >
            </td>

            <td>
                <input
                    type="time"
                    class="campo-editavel"
                    value="${saidaManha}"
                    disabled
                >
            </td>

            <td>
                <input
                    type="time"
                    class="campo-editavel"
                    value="${inicioTarde}"
                    disabled
                >
            </td>

            <td>
                <input
                    type="time"
                    class="campo-editavel"
                    value="${saidaTarde}"
                    disabled
                >
            </td>

            <td class="campo-assinatura">
                <canvas
                    class="canvas-assinatura"
                    width="150"
                    height="35"
                ></canvas>

                <button
                    type="button"
                    class="botao-apagar-assinatura"
                    onclick="apagarAssinatura(this)"
                    disabled
                >
                    Apagar
                </button>
            </td>

            <td>
                <input
                    type="text"
                    class="campo-observacao"
                    value="${observacao}"
                    disabled
                >
            </td>
        `

        corpoTabela.appendChild(linha)

        configurarAssinatura(
            linha.querySelector(".canvas-assinatura")
        )
    }


    mostrarMensagem(
        "Ficha gerada com sucesso.",
        "sucesso"
    )
}


function alternarEdicao() {
    const camposEditaveis = document.querySelectorAll(
        ".campo-editavel, .campo-observacao"
    )

    const botoesApagar = document.querySelectorAll(
        ".botao-apagar-assinatura"
    )

    const canvasAssinaturas = document.querySelectorAll(
        ".canvas-assinatura"
    )

    if (camposEditaveis.length === 0) {
        mostrarMensagem("Gere a ficha antes de editar.")
        return
    }

    tabelaEmEdicao = !tabelaEmEdicao

    camposEditaveis.forEach(function (campo) {
        campo.disabled = !tabelaEmEdicao
    })

    botoesApagar.forEach(function (botao) {
        botao.disabled = !tabelaEmEdicao
    })

    canvasAssinaturas.forEach(function (canvas) {
        canvas.classList.toggle(
            "assinatura-editavel",
            tabelaEmEdicao
        )
    })

    const botaoEditar = document.querySelector(".botao.editar")

    if (tabelaEmEdicao) {
        botaoEditar.textContent = "Salvar alterações"

        mostrarMensagem(
            "Edite os horários, observações ou desenhe as assinaturas.",
            "sucesso"
        )
    } else {
        botaoEditar.textContent = "Editar tabela"

        mostrarMensagem(
            "Alterações salvas na tabela.",
            "sucesso"
        )
    }
}


function configurarAssinatura(canvas) {
    const contexto = canvas.getContext("2d")

    let desenhando = false

    function obterPosicao(evento) {
        const retangulo = canvas.getBoundingClientRect()

        return {
            x: (evento.clientX - retangulo.left) *
                (canvas.width / retangulo.width),

            y: (evento.clientY - retangulo.top) *
                (canvas.height / retangulo.height)
        }
    }

    canvas.addEventListener("pointerdown", function (evento) {
        if (!tabelaEmEdicao) {
            return
        }

        desenhando = true

        canvas.setPointerCapture(evento.pointerId)

        const posicao = obterPosicao(evento)

        contexto.beginPath()
        contexto.moveTo(posicao.x, posicao.y)
    })

    canvas.addEventListener("pointermove", function (evento) {
        if (!desenhando || !tabelaEmEdicao) {
            return
        }

        const posicao = obterPosicao(evento)

        contexto.lineWidth = 1.5
        contexto.lineCap = "round"
        contexto.strokeStyle = "#000"

        contexto.lineTo(posicao.x, posicao.y)
        contexto.stroke()
    })

    canvas.addEventListener("pointerup", function () {
        desenhando = false
    })

    canvas.addEventListener("pointerleave", function () {
        desenhando = false
    })
}


function apagarAssinatura(botao) {
    const canvas = botao.parentElement.querySelector(
        ".canvas-assinatura"
    )

    const contexto = canvas.getContext("2d")

    contexto.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    )
}


function imprimirFrequencia() {
    const funcionario = funcionarioInput.value.trim()
    const cargo = cargoInput.value.trim()
    const mes = mesInput.value
    const ano = anoInput.value

    if (
        funcionario === "" ||
        cargo === "" ||
        mes === "" ||
        ano === ""
    ) {
        mostrarMensagem(
            "Preencha todos os campos antes de imprimir."
        )

        return
    }

    if (corpoTabela.children.length === 0) {
        mostrarMensagem(
            "Gere a ficha antes de imprimir."
        )

        return
    }

    window.print()
}


function limparTabela() {
    funcionarioInput.value = ""
    cargoInput.value = ""
    mesInput.value = ""
    anoInput.value = ""

    nomeExibicao.textContent =
        "_______________________________________________"

    cargoExibicao.textContent =
        "________________________________"

    referenciaExibicao.textContent = "--/----"

    corpoTabela.innerHTML = `
        <tr>
            <td colspan="9" class="sem-dados">
                Preencha os dados acima e clique em
                “Gerar ficha”.
            </td>
        </tr>
    `

    tabelaEmEdicao = false

    const botaoEditar = document.querySelector(".botao.editar")
    botaoEditar.textContent = "Editar tabela"

    mostrarMensagem("")
}


document.addEventListener("DOMContentLoaded", function () {
    const dataAtual = new Date()

    mesInput.value = dataAtual.getMonth() + 1
    anoInput.value = dataAtual.getFullYear()
})

function duplicarAssinatura() {
    const primeiraAssinatura = document.querySelector(".canvas-assinatura")

    if (!primeiraAssinatura) {
        mostrarMensagem("Gere a ficha antes de duplicar a assinatura.")
        return
    }

    const canvasPrincipal = primeiraAssinatura
    const contextoPrincipal = canvasPrincipal.getContext("2d")

    const imagemAssinatura = contextoPrincipal.getImageData(
        0,
        0,
        canvasPrincipal.width,
        canvasPrincipal.height
    )

    const assinaturas = document.querySelectorAll(".canvas-assinatura")

    assinaturas.forEach(function (canvas, indice) {
        if (indice === 0) {
            return
        }

        const contexto = canvas.getContext("2d")

        contexto.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        )

        contexto.putImageData(
            imagemAssinatura,
            0,
            0
        )
    })

    mostrarMensagem(
        "Assinatura duplicada em todas as linhas.",
        "sucesso"
    )
}