const express = require("express");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const cors = require("cors");
const pdfParse = require("pdf-parse");

class QuestionBankParser {
  static parseQuestionBank(fileContent) {
    const blocks = fileContent
      .split("@@")
      .filter((block) => block.trim() !== "");
    const questions = [];

    blocks.forEach((block) => {
      const questionData = {};
      const lines = block.trim().split("\n");
      lines.forEach((line) => {
        const parts = line.split("-");
        if (parts.length === 2) {
          const key = parts[0].trim().replace("@", "");
          const value = parts[1].trim();
          questionData[key] = value;
        }
      });

      if (questionData.question && ["A", "B"].includes(questionData.section)) {
        questions.push(questionData);
      }
    });

    return questions;
  }

  static groupQuestionsBySection(questions) {
    return questions.reduce((grouped, question) => {
      const key = question.section;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(question);
      return grouped;
    }, {});
  }
}

class questionpapergenerator {
  constructor(questions) {
    this.questions = questions;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  generateQuestionPaper() {
    const groupedQuestions = QuestionBankParser.groupQuestionsBySection(
      this.questions
    );
    const questionPaper = {};

    for (const section in groupedQuestions) {
      let questionsInSection = groupedQuestions[section];
      questionsInSection = this.shuffleArray(questionsInSection);

      if (section === "A") {
        questionPaper[section] = questionsInSection.slice(0, 10);
      } else if (section === "B") {
        questionPaper[section] = questionsInSection.slice(0, 5);
      } else {
        questionPaper[section] = questionsInSection;
      }
    }

    return questionPaper;
  }
}

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/extract-pdf-text", upload.single("pdfUpload"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const fileContent = pdfData.text;

    const questions = QuestionBankParser.parseQuestionBank(fileContent);

    if (questions.length === 0) {
      return res.status(400).json({
        error: "No valid questions found",
        details: "Unable to parse questions from the uploaded file",
      });
    }

    const generator = new questionpapergenerator(questions);
    const questionPaper = generator.generateQuestionPaper();

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="question_paper.pdf"'
    );
    doc.pipe(res);
    doc.image("/Users/nareshbalagani/Downloads/cmrlogo.jpg", 50, 30, { width: 100 });
  
    doc.fontSize(16).text("CMR Engineering college", { align: "center" });
    doc.fontSize(12).text("Max :60Marks", { align: "right" });
    doc.fontSize(12).text("D.O.E : 01-02-2025", { align: "right" });
    doc.fontSize(12).text("term:End-sem", { align: "right" });
    doc.fontSize(12).text("Subject:Physics", { align: "center" });
    doc.moveDown();

    Object.entries(questionPaper).forEach(([section, questions]) => {
      doc.fontSize(14).text(section, { underline: true });
      doc.moveDown();
      questions.forEach((question, index) => {
        doc.text(`${index + 1}. ${question.question}`);
        doc.moveDown();

        if (section === "B" && question.choice1 && question.choice2) {
          doc.text(`    ${question.choice1}`);
          doc.moveDown();
          doc.text(`    (OR)`);
          doc.moveDown();
          if (question.choice3 && question.choice4) {
            doc.text(`    ${question.choice3}`);
            doc.moveDown();
          }
        }
      });
    });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({
      error: "Failed to generate question paper",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});