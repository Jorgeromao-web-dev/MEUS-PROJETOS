const express = require('express');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const bodyParser = require('body-parser');
const path = require('path'); // Para facilitar o caminho do arquivo
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname))); // Para servir arquivos estáticos

// Rota para a página de recepção
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve a página index.html
});

// Rota para o formulário
app.get('/formulario', (req, res) => {
    res.send(`
        <link rel="stylesheet" href="formulario.css"> <!-- Link para o novo CSS -->
        <div class="container mt-5">
            <h1 class="text-center">FICHA DE MATRÍCULA</h1>
            <h1 class="text-center">CENTRO INFANTIL VERONAS DAVIT</h1>
            <p class="text-center">Ano lectivo: ______/_______</p> \n
            <p>Solicitamos que faça a leitura detalhada e preencha cuidadosamente os dados.
             Favor atentar-se ao Termo de compromisso firmado ao final da matrícula. 
             Os dados fornecidos são de inteira responsabilidade dos pais e encarregado de educação.</p> \n
            <form action="/submit" method="POST">
                <h2> Informações Pessoais</h2>
                <strong>Nome da Criança:</strong> <input type="text" name="child_name" required placeholder="Nome da criança" ><br>
                <strong>Filho (a) de: </strong>  <input type="text" name="parent1" required placeholder="Nome do pai ou mãe"><br>
                <strong>E de: </strong>  <input type="text" name="parent2" required placeholder="Nome do outro responsável"><br>
                <strong>Nascido (a) aos:  </strong> <input type="date" name="birthdate" required placeholder="Data de nascimento da criança"><br>
                <strong>Em:  </strong> <input type="text" name="birthplace" required placeholder="Local de nascimento"><br>
                <strong> Província:  </strong> <input type="text" name="province" required placeholder="Província em que nasceu" ><br>
                <strong> Céd. B.I. Nº:</strong> <input type="text" name="bi_number" placeholder="Número da cedula ou BI"><br>

                <h2>Informações de Contato</h2>
               
                <strong>Morada:  </strong> <input type="text" name="address" placeholder="Sua morada atual"><br>
                <strong>Encarregado (a): </strong> <input type="text" name="guardian_name" placeholder="Nome do Encarregado"><br>
                <strong>Contacto: </strong>  <input type="tel" name="phone_number_1" placeholder="Contacto do Encarregado"><br>

                <h2>Escolha do Curso</h2>
               <strong>Matrícula || Transferência: </strong> <br>
               <br>
               <strong>Creche   ||  Berçário: </strong>
                <select name="creche_bercario">
                    <option value="pureza_a">Sala Pureza A (Dos 06 meses / 11 meses)</option>
                    <option value="alegria">Sala Alegria (Pré-Escolar 1 - 3 anos)</option>
                    <option value="pureza_b">Sala Pureza B (1 ano)</option>
                    <option value="amor_c">Sala Amor C (2 anos)</option>
                    <!-- Adicione mais opções conforme necessário -->
                </select><br>

                <!-- Campos adicionais para quem virá buscar a criança -->
                <h2>Quem virá buscar a criança habitualmente?</h2>\n
                a) Nome: <input type="text" name="guardian1_name" placeholder=" Nome de quem virá buscar a criança"> Tel: <input type="tel" name="guardian1_phone placeholder=" Número de quem virá buscar a criança"><br>
                b) Nome: <input type="text" name="guardian2_name" placeholder=" Nome de quem virá buscar a criança"> Tel: <input type="tel" name="guardian2_phone" placeholder=" Número de quem virá buscar a criança" ><br>
               

                <!-- Contato em caso de emergência -->
                <h2>Contato em Caso de Emergência</h2>
              <strong>a) Nome:  </strong>  <input type="text" name="emergency_contact1_name" placeholder=" Nome do contacto de emergência"> Tel: <input type="tel" name="emergency_contact1_phone" placeholder=" Número do contacto de emergência" ><br>
               <strong>b) Nome:  </strong> <input type="text" name="emergency_contact2_name" placeholder=" Nome do contacto de emergência">  Tel: <input type="tel" name="emergency_contact2_phone" placeholder=" Número do contacto de emergência"><br>
                

                <!-- Seguro e Problemas de Saúde -->
                <h2>Seguro e Saúde</h2>
                <strong>A criança tem algum seguro de saúde?</strong> <br>
                Sim<input type='radio' name='health_insurance' value='Sim'> <br>
                Não<input type='radio' name='health_insurance' value='Não'><br>
                <br>

                <strong>A criança tem algum problema de saúde?</strong> <br>
                Sim<input type='radio' name='health_issue' value='Sim'> <br>
                Não<input type='radio' name='health_issue' value='Não'><br>
                <br>
                <strong> Se sim, especifique:</strong><br>
                Visual<input type='checkbox' name='health_conditions[]' value='Visual'> <br>
                Auditivo<input type='checkbox' name='health_conditions[]' value='Auditivo'> <br>
                Respiratório<input type='checkbox' name='health_conditions[]' value='Respiratório'> <br>
                Fala<input type='checkbox' name='health_conditions[]' value='Fala'> <br> <br>
               <strong>Outros:</strong><input type='text' name='other_health_condition' placeholder=" Descreva a condição de saúde da Criança"><br><br>

                <!-- Termo de Responsabilidade -->
                Eu, ______________________________________________________ encarregado (a) de educação do (a) aluno (a) __________________________________________ inscrevo o meu educando nesta instituição e comprometo-me em respeitar o que está constituído neste termo de responsabilidade.<br>

                Depois de ter lido o respectivo termo, concordo e assino:<br>
                ______________________________________________________.<br>

                Assinatura do encarregado __________________________________________ A Secretaria ____________________________<br>

                <!-- Botões para enviar ou limpar o formulário -->
                <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                    <button type="submit" class="btn btn-success">Enviar Matrícula</button>
                    <button type="reset" class="btn btn-danger limpiar-btn">Limpar Formulário</button> <!-- Botão Limpar estilizado -->
                    <a href="/" class="btn btn-secondary">Voltar à Página Inicial</a> 
                </div>
            </form>
        </div>
    `);
});

// Rota para processar o formulário
app.post('/submit', (req, res) => {
    const {
        child_name,
        parent1,
        parent2,
        birthdate,
        birthplace,
        province,
        bi_number,
        address,
        guardian_name,
        phone_number_1,
        creche_bercario,
        guardian1_name,
        guardian1_phone,
        guardian2_name,
        guardian2_phone,
        emergency_contact1_name,
        emergency_contact1_phone,
        emergency_contact2_name,
        emergency_contact2_phone,
        health_insurance,
        health_issue,
        health_conditions = [],
        other_health_condition
    } = req.body;

    // Gerar PDF
    const doc = new PDFDocument();
    let pdfBuffer = [];
    doc.on('data', pdfBuffer.push.bind(pdfBuffer));
    doc.on('end', () => {
        const pdfData = Buffer.concat(pdfBuffer);
        
        // Enviar e-mail
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'romaogeorge877@gmail.com',
                pass: 'pfbuxnfzxsgikgcr'
            },
            tls: {
              rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: 'romaogeorge877@gmail.com',
            to: 'destinatario@example.com', // Altere para o endereço correto
            subject: 'Confirmação de Matrícula',
            text: `Olá ${child_name}, sua matrícula foi realizada com sucesso!`,
            attachments: [{
              filename: 'matricula.pdf',
              content: pdfData,
              contentType: 'application/pdf'
            }]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Erro ao enviar e-mail:', error);
              return res.status(500).send('Erro ao enviar e-mail.');
            }
            console.log('E-mail enviado:', info.response);
            res.redirect('/sucess.html');
        });
    });

    // Adicionar logotipo ao PDF
    const logoPath = path.join(__dirname, 'img', 'logo.jpg'); // Caminho atualizado para o logotipo na pasta img
    doc.image(logoPath, { fit: [150, 150], align: 'center', valign: 'top' }); // Ajuste as dimensões conforme necessário

    // Adicionar um espaço após o logotipo
    doc.moveDown(1); // Move para baixo 1 unidade

    // Adicionar título e subtítulos em negrito
    doc.font('Helvetica-Bold').fontSize(18).text('CENTRO INFANTIL VERONAS DAVIT', { align: 'right' });
    doc.fontSize(15).text('SUBDIRECÇÃO ADMINISTRATIVA', { align: 'right' });

    // Aumentar ainda mais o espaçamento antes do subtítulo "FICHA DE MATRÍCULA"
    doc.moveDown(2.9); // Move para baixo 1.5 unidades

    doc.fontSize(14).text('FICHA DE MATRÍCULA PARA O CENTRO INFANTIL', { align: 'center' });

    // Voltar à fonte normal para o restante do texto
    doc.font('Helvetica').moveDown(0.5); // Move para baixo 0.5 unidades
    doc.fontSize(12).text('Este é o formulário de matrícula da criança para frequentar ao Centro Infantil Veronas Davit no ano lectivo ______/_______.', { align: 'left' });
    doc.moveDown(0.5); // Move para baixo 0.5 unidades
    doc.text('Solicitamos que façam a leitura detalhada e preencham cuidadosamente os dados. Os dados fornecidos são de inteira responsabilidade dos pais e encarregado de educação.', { align: 'left' });

    // Adicionar informações da matrícula
    doc.moveDown(1); // Move para baixo 1 unidade antes das informações pessoais
    doc.fontSize(12).text(`Nome da Criança: ${child_name}`);
    doc.moveDown(0.5); // Move para baixo 0.5 unidades
    doc.text(`Filho(a) de: ${parent1} e ${parent2}`);
    doc.moveDown(0.5); // Move para baixo 0.5 unidades
    doc.text(`Nascido(a) aos: ${birthdate}`);
    doc.moveDown(0.5); // Move para baixo 0.5 unidades
    doc.text(`Em: ${birthplace}`);
    doc.moveDown(0.5); // Move para baixo 0.5 unidades
    doc.text(`Província: ${province}`);
    doc.moveDown(0.5); // Move para baixo 0.5 unidades
    doc.text(`Céd. B.I. Nº: ${bi_number}`);
    doc.moveDown(0.5); // Move para baixo 0.5 unidades
    doc.text(`Morada: ${address}`);
    doc.moveDown(0.5); // Move para baixo 0.5 unidades
    doc.text(`Encarregado(a): ${guardian_name}`);
    doc.moveDown(0.5); // Move para baixo 0.5 unidades
    doc.text(`Telefone Nº: ${phone_number_1}`);

   // Informações sobre quem virá buscar a criança
   doc.moveDown(1);
   doc.fontSize(12).text('Quem virá buscar a criança habitualmente?');
   if (guardian1_name && guardian1_phone) {
       doc.text(`a) Nome: ${guardian1_name}, Tel:${guardian1_phone}`);
   }
   if (guardian2_name && guardian2_phone) {
       doc.text(`b) Nome:${guardian2_name}, Tel:${guardian2_phone}`);
   }

   // Contatos em caso de emergência
   doc.moveDown(1);
   doc.fontSize(12).text('Contatos em Caso de Emergência:')
   if (emergency_contact1_name && emergency_contact1_phone) {
       doc.text(`a) Nome:${emergency_contact1_name}, Tel:${emergency_contact1_phone}`);
   }
   if (emergency_contact2_name && emergency_contact2_phone) {
       doc.text(`b) Nome:${emergency_contact2_name}, Tel:${emergency_contact2_phone}`);
   }
 

   // Seguro e Saúde
   doc.moveDown(1);
   doc.fontSize(12).text('Informações sobre Saúde:')
   if (health_insurance === "Sim") {
       doc.text("Seguro de Saúde : Sim");
   } else {
       doc.text("Seguro de Saúde : Não");
   }

   if (health_issue === "Sim") {
       doc.text("Problema de Saúde : Sim");
       if (health_conditions.length > 0) {
           const conditions = health_conditions.join(', ');
           doc.text(`Condições Específicas : ${conditions}`);
       }
       if (other_health_condition) {
           doc.text(`Outros Problemas : ${other_health_condition}`);
       }
   } else {
       doc.text("Problema de Saúde : Não");
   }
   doc.moveDown(5.5)
   const termContentone = `
   
   Registo nº_______/ Matrícula e Confirmação \n

   Ano Lectivo _________/_________ \n

   Nome do (a) aluno (a) _____________________________________________, inscreve - se no _______________________ pela ______ vez no Veronas Davit abc.\n

   Luanda,______ de ____________________________ de ______________.\n

   Assinatura do encarregado __________________________________________ A Secretaria _______________________________.
   `;
   doc.fontSize(12).font('Helvetica').text(termContentone);
   // Adicionar uma nova página para o Termo de Responsabilidade
   doc.addPage(); 

   // Adicionar logotipo na nova página na mesma posição da primeira página
   const logoPathTermo = path.join(__dirname, 'img', 'logo.jpg'); 
   doc.image(logoPathTermo, { fit: [150, 150], align: 'center', valign: 'top' }); 

   // Adicionar um espaço após o logotipo na nova página
   doc.moveDown(6.6); 

   // Título da seção "Termo de Responsabilidade"
   doc.fontSize(16).font('Helvetica-Bold').text('TERMO DE RESPONSABILIDADE', { align: 'center' });
   doc.moveDown(); 

   const termContent = `
  
   Eu __________________________________________________ encarregado de educação do (a) aluno (a) ____________________________________________ inscrevo o meu educando nesta instituição e comprometo - me perante há direcção do Centro Infantil Veronas Davit em respeitar o que está constituido neste termo de responsabilidade. \n
   1º Pagar mensalmente as propinas conforme o valor praticado, correspondente ao ano lectivo que decorre, nos termos de Despachos nº 138/2000 de 10 de Novembro, do Ministério da Educação (de Setembro a Junho ou Dezembro conforme o nível a frequentar ). \n
   2º Pagar as propinas do meu educando nos prazos legalmente estabelecidos pelo Centro Infantil de 01 a 10 de cada mês. \n
   3º Em caso de atraso, pagar a multa da propina correspondente de acordo com o que está estipulado no regulamento interno do Centro Infantil, que é de 30% de 11 à 15, 35% de 16 à 20 e 40% de 21 à 26. \n
   4º Em caso de atraso no pagamento, superior a 40 (quarenta) dias, concordo que meu educando seja suspenso da frequência das aulas, actividades temporariamente, até a regularização da situação. \n

   5º Recolher o meu educando após o término das aulas para Creche e Jardim de Infância até (20:00 min). Podendo a Direcção da instituição, tomar as medidas regulamentares convenientes em caso de incumprimento. \n
   6º Em caso de atraso na recolha do meu Educando que frequenta o Centro Infantil, comprometo -me a pagar a multa de 10.000,00 Kz (Dez Mil kwanzas por cada minuto de atraso. \n
   7º Adquirir o uniforme no Centro Infantil  e zelar pela sua conservação e uso pelo meu educando para que o mesmo se apresente devidamente uniformizado diariamente. \n
   8º Adquirir todo material didáctico necessário, orientado pela Direcção para o meu educando.\n
   9º Caso o uniforme não estiver em bom estado de conservação, comprometo - me a adquirir outro.\n
   10º Caso tenha dois filhos ou mais, e não pagar a propina dentro do prazo estipulado, perco 4% do beneficio de desconto.\n
   11º Dispensar o meu educando para as actividades extraescolares e outras de carácter educativo ou patriótico.   \n
   12º Comprometo-me a fazer o acompanhamento para o desenvolvimento escolar do meu educando, nos seguintes aspectos: Tarefas escolares, comportamento diário, assinatura da Caderneta escolar no final de cada Trimestre, comparecer às reuniões sempre que for convocado e apresentar reclamações e sugestões quando e sempre que houver motivos para o efeito. \n  
   13º Em caso de devoluções, deve ser feito por escrito, os valores serão ressarcidos após 20 dias a contar com a data de entrada da solicitação. \n
   14º Tomei o conhecimento de todos os termos e condições da instituição (Regulamento interno da instituição).\n 
   15º Pelo incumprimento das Alíneas 1º, 2º, 3º e 4º, concordo que o Centro Infantil recorra a meu desfavor aos órgãos judiciais e retenha o processo individual do meu educando, bem como todos os pedidos formulados para emissão de qualquer documento solicitado a favor do mesmo, nomeadamente:\n
    Declarações para diversos efeitos, transferência, certificado, etc.   

   `;

   // Adicionar conteúdo ao PDF com formatação adequada na terceira página.
   doc.fontSize(14).font('Helvetica').text(termContent);


// Adicionar logotipo na nova página na mesma posição da primeira página
const logoPathTermoTwo = path.join(__dirname, 'img', 'logo.jpg'); 
doc.image(logoPathTermo, { fit: [150, 150], align: 'center', valign: 'top' }); 
doc.font('Helvetica-Bold').fontSize(18).text('CENTRO INFANTIL VERONAS DAVIT', { align: 'right' });
doc.fontSize(15).text('SUBDIRECÇÃO ADMINISTRATIVA', { align: 'right' });
doc.moveDown(3.3); 
// Adicionar um espaço após o logotipo na nova página


// Título da seção "Termo de Responsabilidade"
doc.fontSize(16).font('Helvetica-Bold').text('TERMO DE RESPONSABILIDADE FINANCEIRA', { align: 'center' });

  const termContentTwo = ` 
  
 De formas a alcançar o sucesso desejado no processo de ensino e apredizagem, o encarregado deve cumprir com a regularização de pagamentos, caso contrário, o educando terá a sua matrícula anulada ou rescisão da confirmação no ano posterior.

 1º O prazo estabecido do pagamento das propinas é de 01 à 10 do mês em curso.
  \n
 2º A multa varia de 30% de 11 à 15, 35% de 16 à 20 e 40% de 21 à 26 do mês em curso;
  \n
 3º A partir do dia 01 do mês a seguir ao da cobrança o aluno pode ser suspenso até regularizar a situação de dívida junto a secretaria, excepto se o encarregado antecipar a sua justificação junto da Direcção Administrativa, desde que não seja frequente.
  \n
 Eu ______________________________________________________ encarregado (a) de educação do (a) aluno (a) ________________________________________ inscrevo o meu educando nesta instituição e comprometo – me em respeitar o que está constituído neste termo de responsabilidade.
  \n
 Depois de ter lido o respectivo termo, concordo e assino: ______________________________________________________.
  \n
 A Secretaria:__________________________________________, Luanda,______ de ______________________________ de _________

  `;
  doc.fontSize(14).font('Helvetica').text(termContentTwo);
 
   // Finalizar documento PDF
   doc.end();
});



// Iniciar servidor na porta desejada
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});