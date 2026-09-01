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
];

const diasSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
];

function gerarFrequencia() {

    const funcionario = document
        .getElementById("funcionario")
        .value
        .trim();

    const cargo = document
        .getElementById("cargo")
        .value
        .trim();

    const mes = Number(
        document.getElementById("mes").value
    );

    const ano = Number(
        document.getElementById("ano").value
    );

    if (funcionario === "") {
        alert("Digite o nome do funcionário.");
        document.getElementById("funcionario").focus();
        return;
    }

    if (cargo === "") {
        alert("Digite o cargo do funcionário.");
        document.getElementById("cargo").focus();
        return;
    }

    if (mes < 1 || mes > 12) {
        alert("Selecione um mês válido.");
        document.getElementById("mes").focus();
        return;
    }

    if (ano < 1900 || ano > 2100) {
        alert("Digite um ano entre 1900 e 2100.");
        document.getElementById("ano").focus();
        return;
    }

    document.getElementById(
        "nomeExibicao"
    ).textContent = funcionario;

    document.getElementById(
        "cargoExibicao"
    ).textContent = cargo;

    document.getElementById(
        "periodoExibicao"
    ).textContent = `${meses[mes - 1]} / ${ano}`;

    const quantidadeDias = new Date(
        ano,
        mes,
        0
    ).getDate();

    const corpoTabela = document.getElementById(
        "corpoTabela"
    );

    corpoTabela.innerHTML = "";

    for (let dia = 1; dia <= quantidadeDias; dia++) {

        const data = new Date(
            ano,
            mes - 1,
            dia
        );

        const diaSemana = data.getDay();

        const nomeDia = diasSemana[diaSemana];

        const saidaTarde =
            diaSemana === 2
                ? "21:00"
                : "17:00";

        const diaFormatado = String(
            dia
        ).padStart(2, "0");

        const mesFormatado = String(
            mes
        ).padStart(2, "0");

        const dataFormatada =
            `${diaFormatado}/${mesFormatado}/${ano}`;

        const tr = document.createElement("tr");

        if (
            diaSemana === 0 ||
            diaSemana === 6
        ) {
            tr.classList.add(
                "fim-de-semana"
            );
        }

        tr.innerHTML = `
            <td>${diaFormatado}</td>

            <td>${dataFormatada}</td>

            <td>
                <strong>${nomeDia}</strong>
            </td>

            <td>
                <span class="horario-fixo">
                    07:00
                </span>
            </td>

            <td>
                <span class="horario-fixo">
                    11:00
                </span>
            </td>

            <td>
                <span class="horario-fixo">
                    13:00
                </span>
            </td>

            <td>
                <span class="horario-fixo">
                    ${saidaTarde}
                </span>
            </td>

            <td class="celula-assinatura">
                <div class="linha-assinatura-dia"></div>
            </td>
        `;

        corpoTabela.appendChild(tr);
    }
}

function imprimirFrequencia() {

    const tabela = document.getElementById(
        "corpoTabela"
    );

    if (tabela.children.length === 0) {
        alert(
            "Primeiro gere a lista de frequência."
        );
        return;
    }

    window.print();
}

function limparTabela() {

    const confirmar = confirm(
        "Deseja realmente limpar a frequência?"
    );

    if (!confirmar) {
        return;
    }

    document.getElementById(
        "corpoTabela"
    ).innerHTML = "";

    document.getElementById(
        "nomeExibicao"
    ).textContent = "---";

    document.getElementById(
        "cargoExibicao"
    ).textContent = "---";

    document.getElementById(
        "periodoExibicao"
    ).textContent = "---";

    document.getElementById(
        "funcionario"
    ).value = "";

    document.getElementById(
        "cargo"
    ).value = "";
}

window.addEventListener(
    "DOMContentLoaded",
    function() {

        const dataAtual = new Date();

        const mesAtual =
            dataAtual.getMonth() + 1;

        const anoAtual =
            dataAtual.getFullYear();

        document.getElementById(
            "mes"
        ).value = mesAtual;

        document.getElementById(
            "ano"
        ).value =
            anoAtual >= 1900 &&
            anoAtual <= 2100
                ? anoAtual
                : 2026;
    }
);
