const frm = document.querySelector("#formReserva");
    const respNome = document.querySelector("span");
    const respLista = document.querySelector("pre");
    const erroMsg = document.getElementById("textoerroadd");

    const reservas = [];

    function salvarReservas() {
      localStorage.setItem("reservas", JSON.stringify(reservas));
    }

    function atualizarLista() {
      let lista = "";
      reservas.forEach((reserva, i) => {
        lista += `${i + 1}. ${reserva.professor} - Lab ${reserva.lab} - ${reserva.hora}\n`;
      });
      respLista.innerText = lista;
      salvarReservas();
    }

    // Carregar reservas ao iniciar
    window.addEventListener("load", () => {
      const dadosSalvos = localStorage.getItem("reservas");
      if (dadosSalvos) {
        reservas.push(...JSON.parse(dadosSalvos));
        atualizarLista();
      }
    });

    // Evento "Reservar com Prioridade"
    frm.prioridade.addEventListener("click", () => {
      const professor = frm.professor.value.trim();
      const lab = frm.lab.value.trim();
      const hora = frm.dia.value;

      if (professor === "" || lab === "" || hora === "") {
        erroMsg.innerText = "Informe o nome do professor, o laboratório e o horário.";
        frm.professor.focus();
        return;
      }

      const conflito = reservas.some(r => r.lab === lab && r.hora === hora);
      if (conflito) {
        erroMsg.innerText = `Erro: O laboratório ${lab} já está reservado para o horário ${hora}.`;
        return;
      }

      erroMsg.innerText = "";
      reservas.unshift({ professor, lab, hora });
      reservas.sort((a, b) => new Date(a.hora) - new Date(b.hora));
      atualizarLista();

      frm.reset();
      frm.professor.focus();
    });

    // Evento "Usar"
    frm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (reservas.length === 0) {
        erroMsg.innerText = "Nenhuma reserva disponível para uso.";
        return;
      }

      const idReserva = prompt("Informe o número da reserva a ser utilizada:");
      const index = parseInt(idReserva) - 1;

      if (isNaN(index) || index < 0 || index >= reservas.length) {
        erroMsg.innerText = "Erro: Número da reserva inválido.";
        return;
      }

      erroMsg.innerText = "";
      const usada = reservas.splice(index, 1)[0];
      respNome.innerText = `Reserva utilizada com sucesso: ${usada.professor} - Lab ${usada.lab} - ${usada.hora}`;
      atualizarLista();

      frm.reset();
      frm.professor.focus();
    });

    // Evento "Cancelar uso"
    frm.atender.addEventListener("click", () => {
      if (reservas.length === 0) {
        alert("Não há reservas na lista.");
        frm.professor.focus();
        return;
      }

      const idReserva = prompt("Informe o número da reserva a ser cancelada:");
      const reservaIndex = parseInt(idReserva) - 1;

      if (isNaN(reservaIndex) || reservaIndex < 0 || reservaIndex >= reservas.length) {
        alert("Reserva inválida.");
        return;
      }

      const cancelada = reservas.splice(reservaIndex, 1)[0];
      respNome.innerText = `Cancelada: ${cancelada.professor} - Lab ${cancelada.lab} - ${cancelada.hora}`;
      atualizarLista();

      setTimeout(() => {
        respNome.innerText = "";
      }, 5000);
    });