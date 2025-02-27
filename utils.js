function parseQuestionBank(text) {
  const questionBank = {
      sectionA: [],
      sectionB: [],
      // You can add more sections as needed
  };

  // Split the text by @@ to identify each question
  const questionEntries = text.split('@@').filter(entry => entry.trim() !== '');

  questionEntries.forEach(entry => {
      const questionObj = {};
      
      // Extract the relevant details using regex
      const questionMatch = entry.match(/@question-\s*(.*?)\s*\n/);
      const unitMatch = entry.match(/@unit-\s*(.*?)\s*\n/);
      const sectionMatch = entry.match(/@section-\s*(.*?)\s*\n/);
      const bloomsTaxonomyMatch = entry.match(/@blooms taxonomy level-\s*(.*?)\s*\n/);
      
      // Fill the question object with the extracted data
      questionObj.question = questionMatch ? questionMatch[1] : 'No question found';
      questionObj.unit = unitMatch ? unitMatch[1] : 'No unit found';
      questionObj.section = sectionMatch ? sectionMatch[1] : 'No section found';
      questionObj.bloomsTaxonomyLevel = bloomsTaxonomyMatch ? bloomsTaxonomyMatch[1] : 'No level found';

      // Depending on the section, add the question to the appropriate array
      if (questionObj.section.toUpperCase() === 'A') {
          questionBank.sectionA.push(questionObj);
      } else if (questionObj.section.toUpperCase() === 'B') {
          questionBank.sectionB.push(questionObj);
      }
  });

  return questionBank;
}
class QuestionPaperGenerator {
  constructor(questionBank) {
      this.questionBank = questionBank;
  }

  generateQuestionPaper() {
      return {
          
          sectionA: this.generateSection('Section A', this.questionBank.sectionA),
          sectionB: this.generateSection('Section B', this.questionBank.sectionB),
          // You can add more sections if needed
      };
  }

  generateSection(sectionName, questions) {
      return {
          instructions: `Answer all the questions from ${sectionName}`,
          questions: questions.map(q => `${q.question} (Unit: ${q.unit}, Bloom's Taxonomy Level: ${q.bloomsTaxonomyLevel})`),
      };
  }
}

