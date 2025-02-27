function generateQuestionPaper() {
  // Question bank
  const questionBank = [
    {
      q1: 'Q1',
      unit: 1,
      section: 'A',
      bloomsLevel: 'Application'
    },
    {
      q2: 'Q2',
      unit: 2,
      section: 'A',
      bloomsLevel: 'Analysis'
    },
    {
      q3: 'Q3',
      unit: 1,
      section: 'B',
      bloomsLevel: 'Understanding'
    },
    {
      q4: 'Q4',
      unit: 3,
      section: 'B',
      bloomsLevel: 'Evaluating'
    },
    {
      q5: 'Q5',
      unit: 5,
      section: 'A',
      bloomsLevel: 'Creativity'
    },
    {
      q6: 'Q6',
      unit: 2,
      section: 'B',
      bloomsLevel: 'Remembering'
    },
    {
      q7: 'Q7',
      unit: 3,
      section: 'A',
      bloomsLevel: 'Application'
    },
    {
      q8: 'Q8',
      unit: 4,
      section: 'A',
      bloomsLevel: 'Analysis'
    },
    {
      q9: 'Q9',
      unit: 3,
      section: 'B',
      bloomsLevel: 'Understanding'
    },
    {
      q10: 'Q10',
      unit: 4,
      section: 'A',
      bloomsLevel: 'Evaluating'
    },
    {
      q11: 'Q11',
      unit: 5,
      section: 'B',
      bloomsLevel: 'Creativity'
    },
    {
      q12: 'Q12',
      unit: 2,
      section: 'B',
      bloomsLevel: 'Remembering'
    }
  ];

  // Generate Section A
  const sectionA = [];
  const sectionAQuestions = questionBank.filter(q => q.section === 'A');
  for (let i = 0; i < 10; i++) {
    if (sectionAQuestions.length === 0) break;
    const randomIndex = Math.floor(Math.random() * sectionAQuestions.length);
    sectionA.push(sectionAQuestions[randomIndex]);
    sectionAQuestions.splice(randomIndex, 1);
  }

  // Generate Section B
  const sectionB = [];
  const sectionBQuestions = questionBank.filter(q => q.section === 'B');
  for (let i = 0; i < 5; i++) {
    if (sectionBQuestions.length === 0) break;
    const randomIndex = Math.floor(Math.random() * sectionBQuestions.length);
    sectionB.push(sectionBQuestions[randomIndex]);
    sectionBQuestions.splice(randomIndex, 1);
  }

  // Combine sections
  const questionPaper = {
    sectionA: sectionA,
    sectionB: sectionB
  };

  return questionpaper;
}

// Generate the question paper
const questionPaper = generateQuestionPaper();
console.log(questionpaper);
