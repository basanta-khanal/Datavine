"use client"

import { useState, useEffect } from "react"
import { Brain, CheckCircle, CreditCard, Home, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"

// ADHD Assessment Questions - Based on ASRS-v1.1 and DSM-5 criteria
const ADHD_QUESTIONS = [
  {
    id: 1,
    category: "Inattention",
    question:
      "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
    options: ["Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Difficulty completing tasks is a hallmark of inattention.",
  },
  {
    id: 2,
    category: "Inattention",
    question:
      "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
    options: ["Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Poor organizational skills are common in ADHD.",
  },
  {
    id: 3,
    category: "Inattention",
    question: "How often do you have trouble remembering appointments or obligations?",
    options: ["Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Forgetfulness is a common symptom of inattentive ADHD.",
  },
  {
    id: 4,
    category: "Inattention",
    question: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
    options: ["Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Procrastination on mentally demanding tasks is typical.",
  },
  {
    id: 5,
    category: "Inattention",
    question: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
    options: ["Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Fidgeting is a sign of hyperactivity and restlessness.",
  },
  {
    id: 6,
    category: "Hyperactivity",
    question:
      "How often do you leave your seat in meetings or other situations in which you are expected to remain seated?",
    options: ["Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Inability to stay seated is a sign of hyperactivity.",
  },
  {
    id: 7,
    category: "Hyperactivity",
    question: "How often do you feel overly active and compelled to do things, like you have to be busy and on the go?",
    options: ["Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Feeling restless and driven is a sign of hyperactivity.",
  },
  {
    id: 8,
    category: "Impulsivity",
    question: "How often do you find yourself talking too much, when you are in social situations?",
    options: ["Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Excessive talking is a sign of impulsivity.",
  },
  {
    id: 9,
    category: "Impulsivity",
    question: "When you're in a conversation, how often do you find it difficult to wait your turn to speak?",
    options: ["Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Difficulty waiting one's turn is a sign of impulsivity.",
  },
  {
    id: 10,
    category: "Impulsivity",
    question: "How often do you interrupt others when they are busy?",
    options: ["Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Interrupting others is a sign of impulsivity.",
  },
]

// Autism Spectrum Quotient - Short (AQ-10) Questions
const ASD_QUESTIONS = [
  {
    id: 1,
    question: "I often notice small sounds when others do not.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Heightened sensory awareness is common in ASD.",
  },
  {
    id: 2,
    question: "I usually concentrate more on the whole picture, rather than the small details.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Focus on details vs. the big picture.",
  },
  {
    id: 3,
    question: "I find it easy to do more than one thing at once.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Difficulty multitasking is common in ASD.",
  },
  {
    id: 4,
    question: "If there is an interruption, I can switch back to what I was doing very quickly.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Difficulty switching tasks after interruption.",
  },
  {
    id: 5,
    question: "I find it easy to 'read between the lines' when someone is talking to me.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Difficulty understanding implied meanings.",
  },
  {
    id: 6,
    question: "I know how to tell if someone listening to me is getting bored.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Difficulty recognizing social cues.",
  },
  {
    id: 7,
    question: "I am good at social chit-chat.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Difficulty with casual social interactions.",
  },
  {
    id: 8,
    question: "When I talk to people, I tend to have a hard time knowing when it's their turn to speak.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Difficulty with turn-taking in conversations.",
  },
  {
    id: 9,
    question: "I am often unsure how to react in social situations.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Uncertainty in social situations.",
  },
  {
    id: 10,
    question: "I find it difficult to work out people's intentions.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Difficulty understanding others' intentions.",
  },
]

// Anxiety Assessment Questions - Based on GAD-7 and Beck Anxiety Inventory
const ANXIETY_QUESTIONS = [
  {
    id: 1,
    type: "generalized_anxiety",
    category: "Worry and Nervousness",
    question: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
    scoring: [0, 1, 2, 3],
    explanation: "Persistent nervousness and anxiety are core symptoms of generalized anxiety disorder.",
  },
  {
    id: 2,
    type: "generalized_anxiety",
    category: "Worry Control",
    question: "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
    scoring: [0, 1, 2, 3],
    explanation: "Difficulty controlling worry is a hallmark of anxiety disorders.",
  },
  {
    id: 3,
    type: "generalized_anxiety",
    category: "Excessive Worry",
    question: "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
    scoring: [0, 1, 2, 3],
    explanation: "Excessive worry about multiple life areas is characteristic of generalized anxiety.",
  },
  {
    id: 4,
    type: "physical_symptoms",
    category: "Restlessness",
    question: "Over the last 2 weeks, how often have you been bothered by trouble relaxing?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
    scoring: [0, 1, 2, 3],
    explanation: "Physical restlessness and inability to relax are common anxiety symptoms.",
  },
  {
    id: 5,
    type: "physical_symptoms",
    category: "Agitation",
    question:
      "Over the last 2 weeks, how often have you been bothered by being so restless that it's hard to sit still?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
    scoring: [0, 1, 2, 3],
    explanation: "Motor restlessness is a physical manifestation of anxiety.",
  },
  {
    id: 6,
    type: "emotional_symptoms",
    category: "Irritability",
    question: "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
    scoring: [0, 1, 2, 3],
    explanation: "Increased irritability often accompanies anxiety disorders.",
  },
  {
    id: 7,
    type: "cognitive_symptoms",
    category: "Fear",
    question:
      "Over the last 2 weeks, how often have you been bothered by feeling afraid as if something awful might happen?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
    scoring: [0, 1, 2, 3],
    explanation: "Anticipatory fear and catastrophic thinking are common in anxiety.",
  },
  {
    id: 8,
    type: "physical_symptoms",
    category: "Heart Rate",
    question: "How often do you experience a rapid or pounding heartbeat when not exercising?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Increased heart rate is a common physical symptom of anxiety.",
  },
  {
    id: 9,
    type: "physical_symptoms",
    category: "Sweating",
    question: "How often do you experience excessive sweating or clamminess?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Excessive sweating is part of the body's fight-or-flight response to anxiety.",
  },
  {
    id: 10,
    type: "physical_symptoms",
    category: "Breathing",
    question: "How often do you experience shortness of breath or feeling smothered?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Breathing difficulties are common during anxiety episodes.",
  },
  {
    id: 11,
    type: "physical_symptoms",
    category: "Dizziness",
    question: "How often do you feel dizzy, lightheaded, or faint?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Dizziness can result from hyperventilation and anxiety responses.",
  },
  {
    id: 12,
    type: "physical_symptoms",
    category: "Muscle Tension",
    question: "How often do you experience muscle tension, aches, or soreness?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Chronic muscle tension is a common physical manifestation of anxiety.",
  },
  {
    id: 13,
    type: "cognitive_symptoms",
    category: "Concentration",
    question: "How often do you have trouble concentrating or find your mind going blank?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Anxiety can significantly impact concentration and cognitive function.",
  },
  {
    id: 14,
    type: "sleep_symptoms",
    category: "Sleep Disturbance",
    question: "How often do you have trouble falling asleep or staying asleep?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Sleep disturbances are commonly associated with anxiety disorders.",
  },
  {
    id: 15,
    type: "cognitive_symptoms",
    category: "Catastrophic Thinking",
    question: "How often do you find yourself thinking about worst-case scenarios?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Catastrophic thinking patterns are characteristic of anxiety disorders.",
  },
  {
    id: 16,
    type: "behavioral_symptoms",
    category: "Avoidance",
    question: "How often do you avoid situations that make you feel anxious?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Avoidance behaviors can reinforce and maintain anxiety over time.",
  },
  {
    id: 17,
    type: "physical_symptoms",
    category: "Gastrointestinal",
    question: "How often do you experience nausea or stomach problems?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Gastrointestinal symptoms are common in anxiety due to the gut-brain connection.",
  },
  {
    id: 18,
    type: "social_anxiety",
    category: "Social Situations",
    question: "How often do you feel anxious in social situations or when meeting new people?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Social anxiety can be a component of generalized anxiety or a separate condition.",
  },
  {
    id: 19,
    type: "cognitive_symptoms",
    category: "Memory",
    question: "How often do you experience memory problems or forgetfulness?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Anxiety can impact working memory and attention, leading to forgetfulness.",
  },
  {
    id: 20,
    type: "physical_symptoms",
    category: "Trembling",
    question: "How often do you experience trembling, shaking, or feeling shaky?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Trembling is a physical manifestation of the body's stress response.",
  },
  {
    id: 21,
    type: "emotional_symptoms",
    category: "Panic",
    question: "How often do you experience sudden episodes of intense fear or panic?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Panic episodes may indicate panic disorder or severe anxiety.",
  },
  {
    id: 22,
    type: "behavioral_symptoms",
    category: "Perfectionism",
    question: "How often do you feel the need to do things perfectly or worry about making mistakes?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Perfectionism can be both a cause and consequence of anxiety.",
  },
  {
    id: 23,
    type: "cognitive_symptoms",
    category: "Decision Making",
    question: "How often do you have difficulty making decisions, even small ones?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Anxiety can impair decision-making abilities due to overthinking and fear.",
  },
  {
    id: 24,
    type: "physical_symptoms",
    category: "Fatigue",
    question: "How often do you feel tired or exhausted without physical exertion?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Chronic anxiety can be mentally and physically exhausting.",
  },
  {
    id: 25,
    type: "behavioral_symptoms",
    category: "Checking Behaviors",
    question: "How often do you repeatedly check things (locks, emails, etc.) due to worry?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Repetitive checking behaviors can be a response to anxiety and uncertainty.",
  },
  {
    id: 26,
    type: "emotional_symptoms",
    category: "Emotional Overwhelm",
    question: "How often do you feel overwhelmed by your emotions?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Feeling emotionally overwhelmed is common in anxiety disorders.",
  },
  {
    id: 27,
    type: "social_anxiety",
    category: "Performance Anxiety",
    question: "How often do you worry about your performance in work or social situations?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Performance anxiety can significantly impact daily functioning.",
  },
  {
    id: 28,
    type: "cognitive_symptoms",
    category: "Racing Thoughts",
    question: "How often do you experience racing thoughts or your mind jumping from worry to worry?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Racing thoughts are a common cognitive symptom of anxiety.",
  },
  {
    id: 29,
    type: "behavioral_symptoms",
    category: "Procrastination",
    question: "How often do you procrastinate or delay tasks due to anxiety about them?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Procrastination can be an avoidance behavior related to anxiety.",
  },
  {
    id: 30,
    type: "physical_symptoms",
    category: "Physical Tension",
    question: "How often do you feel physically tense or 'wound up'?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    scoring: [0, 1, 2, 3],
    explanation: "Physical tension reflects the body's preparation for perceived threats.",
  },
]

// Visual Questions for Cognitive Assessment
const VISUAL_QUESTIONS = [
  {
    id: 1,
    question: "Select the missing piece in the pattern.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "B",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+1",
    explanation: "The pattern follows a sequence where the shape rotates 90 degrees clockwise.",
  },
  {
    id: 2,
    question: "Which of the following completes the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "C",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+2",
    explanation: "The sequence alternates between adding and subtracting a circle.",
  },
  {
    id: 3,
    question: "Identify the next logical image in the series.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+3",
    explanation: "The pattern involves shifting the shaded area one position to the right.",
  },
  {
    id: 4,
    question: "Choose the image that continues the pattern.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "D",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+4",
    explanation: "The sequence adds one line to the shape in each step.",
  },
  {
    id: 5,
    question: "Which image should come next in the series?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "B",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+5",
    explanation: "The pattern involves flipping the image vertically and changing the color.",
  },
  {
    id: 6,
    question: "Select the missing piece in the pattern.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "C",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+6",
    explanation: "The pattern follows a sequence where the shape rotates 90 degrees clockwise.",
  },
  {
    id: 7,
    question: "Which of the following completes the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+7",
    explanation: "The sequence alternates between adding and subtracting a circle.",
  },
  {
    id: 8,
    question: "Identify the next logical image in the series.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "D",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+8",
    explanation: "The pattern involves shifting the shaded area one position to the right.",
  },
  {
    id: 9,
    question: "Choose the image that continues the pattern.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "B",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+9",
    explanation: "The sequence adds one line to the shape in each step.",
  },
  {
    id: 10,
    question: "Which image should come next in the series?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "C",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+10",
    explanation: "The pattern involves flipping the image vertically and changing the color.",
  },
  {
    id: 11,
    question: "Select the missing piece in the pattern.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "B",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+11",
    explanation: "The pattern follows a sequence where the shape rotates 90 degrees clockwise.",
  },
  {
    id: 12,
    question: "Which of the following completes the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "C",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+12",
    explanation: "The sequence alternates between adding and subtracting a circle.",
  },
  {
    id: 13,
    question: "Identify the next logical image in the series.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+13",
    explanation: "The pattern involves shifting the shaded area one position to the right.",
  },
  {
    id: 14,
    question: "Choose the image that continues the pattern.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "D",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+14",
    explanation: "The sequence adds one line to the shape in each step.",
  },
  {
    id: 15,
    question: "Which image should come next in the series?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "B",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+15",
    explanation: "The pattern involves flipping the image vertically and changing the color.",
  },
  {
    id: 16,
    question: "Select the missing piece in the pattern.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "C",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+16",
    explanation: "The pattern follows a sequence where the shape rotates 90 degrees clockwise.",
  },
  {
    id: 17,
    question: "Which of the following completes the sequence?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+17",
    explanation: "The sequence alternates between adding and subtracting a circle.",
  },
  {
    id: 18,
    question: "Identify the next logical image in the series.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "D",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+18",
    explanation: "The pattern involves shifting the shaded area one position to the right.",
  },
  {
    id: 19,
    question: "Choose the image that continues the pattern.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "B",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+19",
    explanation: "The sequence adds one line to the shape in each step.",
  },
  {
    id: 20,
    question: "Which image should come next in the series?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "C",
    image: "/placeholder.svg?height=200&width=300&text=Pattern+Question+20",
    explanation: "The pattern involves flipping the image vertically and changing the color.",
  },
]

const getIQClassification = (score: number) => {
  if (score >= 140) {
    return {
      category: "Genius or near genius",
      range: "140+",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    }
  } else if (score >= 120) {
    return {
      category: "Very superior intelligence",
      range: "120-139",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    }
  } else if (score >= 110) {
    return {
      category: "Superior intelligence",
      range: "110-119",
      color: "text-green-600",
      bgColor: "bg-green-50",
    }
  } else if (score >= 90) {
    return {
      category: "Normal or average intelligence",
      range: "90-109",
      color: "text-slate-600",
      bgColor: "bg-slate-50",
    }
  } else if (score >= 80) {
    return {
      category: "Dullness",
      range: "80-89",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    }
  } else if (score >= 70) {
    return {
      category: "Borderline deficiency",
      range: "70-79",
      color: "text-red-600",
      bgColor: "bg-red-50",
    }
  } else {
    return {
      category: "Deficiency",
      range: "Below 70",
      color: "text-red-600",
      bgColor: "bg-red-50",
    }
  }
}

const getADHDAssessment = (score: number) => {
  const maxScore = 54
  if (score <= 17) {
    return {
      category: "No indication of ADHD",
      description: "Your score suggests that you do not exhibit significant symptoms of ADHD.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      maxScore,
    }
  } else if (score <= 35) {
    return {
      category: "Possible indication of ADHD",
      description: "Your score indicates some symptoms of ADHD. Further evaluation may be beneficial.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      maxScore,
    }
  } else {
    return {
      category: "Likely indication of ADHD",
      description:
        "Your score suggests a higher likelihood of ADHD. Consulting with a healthcare professional is recommended.",
      color: "text-red-600",
      bgColor: "bg-red-50",
      maxScore,
    }
  }
}

const getASDAssessment = (score: number) => {
  const maxScore = 50
  if (score <= 15) {
    return {
      category: "No indication of ASD",
      description: "Your score suggests that you do not exhibit significant characteristics of ASD.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      maxScore,
    }
  } else if (score <= 30) {
    return {
      category: "Possible indication of ASD",
      description: "Your score indicates some characteristics of ASD. Further evaluation may be beneficial.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      maxScore,
    }
  } else {
    return {
      category: "Likely indication of ASD",
      description: "Your score suggests a higher likelihood of ASD. Consulting with a specialist is recommended.",
      color: "text-red-600",
      bgColor: "bg-red-50",
      maxScore,
    }
  }
}

const getAnxietyAssessment = (score: number) => {
  if (score <= 15) {
    return {
      category: "Minimal anxiety",
      description: "Your responses suggest minimal anxiety symptoms.",
      color: "text-slate-700",
      bgColor: "bg-slate-50",
      maxScore: 90,
    }
  }
  if (score <= 30) {
    return {
      category: "Mild anxiety",
      description: "You may experience mild anxiety symptoms that could benefit from self-care strategies.",
      color: "text-slate-700",
      bgColor: "bg-slate-100",
      maxScore: 90,
    }
  }
  if (score <= 45) {
    return {
      category: "Moderate anxiety",
      description: "You show moderate anxiety symptoms that may benefit from professional support.",
      color: "text-slate-800",
      bgColor: "bg-slate-100",
      maxScore: 90,
    }
  }
  if (score <= 60) {
    return {
      category: "Severe anxiety",
      description: "Consider consulting with a mental health professional for comprehensive evaluation and support.",
      color: "text-slate-900",
      bgColor: "bg-slate-100",
      maxScore: 90,
    }
  }
  return {
    category: "Very severe anxiety",
    description: "Strongly recommend seeking immediate professional mental health support.",
    color: "text-slate-900",
    bgColor: "bg-slate-100",
    maxScore: 90,
  }
}

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })

  const [appState, setAppState] = useState({
    currentView: "home",
    testType: null,
    testResults: null,
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      usedCoupon: false,
      hasPaid: false,
      subscription: "Free",
      subscriptionExpiry: "N/A",
      assessmentHistory: [
        { testType: "IQ Test", testDate: "2024-01-20" },
        { testType: "ADHD Test", testDate: "2024-01-15" },
      ],
    },
  } as any)

  const [answers, setAnswers] = useState<number[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [showCouponField, setShowCouponField] = useState(false)
  const [couponCode, setCouponCode] = useState("")

  useEffect(() => {
    // Check for test parameter in URL
    const urlParams = new URLSearchParams(window.location.search)
    const testParam = urlParams.get("test")

    if (testParam && ["iq", "adhd", "asd", "anxiety"].includes(testParam)) {
      // Auto-start the specified test
      updateState({
        currentView: "gender",
        testType: testParam,
      })
    }
  }, [])

  const updateState = (newState: any) => {
    setAppState((prevState) => ({ ...prevState, ...newState }))
  }

  const getCurrentQuestions = () => {
    switch (appState.testType) {
      case "adhd":
        return ADHD_QUESTIONS
      case "asd":
        return ASD_QUESTIONS
      case "anxiety":
        return ANXIETY_QUESTIONS
      default:
        return VISUAL_QUESTIONS
    }
  }

  const handleGoHome = () => {
    updateState({ currentView: "home" })
  }

  const getTestTitle = () => {
    switch (appState.testType) {
      case "iq":
        return "IQ Assessment"
      case "adhd":
        return "ADHD Assessment"
      case "asd":
        return "ASD Assessment"
      case "anxiety":
        return "Anxiety Assessment"
      default:
        return "Assessment"
    }
  }

  const handlePayment = () => {
    alert("Payment processed successfully!")
    updateState({ currentView: "detailed-results", user: { ...appState.user, hasPaid: true } })
  }

  const handleAnswer = (answer: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (questionIndex < getCurrentQuestions().length - 1) {
      setQuestionIndex(questionIndex + 1)
    } else {
      const testResults = calculateResults()
      updateState({ currentView: "success", testResults })
    }
  }

  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1)
    } else {
      updateState({ currentView: "home" })
    }
  }

  const calculateResults = () => {
    const { testType } = appState
    const questions = getCurrentQuestions()

    if (testType === "iq") {
      let totalCorrect = 0
      questions.forEach((question, index) => {
        if (question.correctAnswer === answers[index]) {
          totalCorrect++
        }
      })

      const iqScore = Math.round(70 + (totalCorrect / questions.length) * 60)
      const percentile = Math.round((iqScore / 180) * 100)

      return {
        iqScore,
        percentile,
        accuracy: Math.round((totalCorrect / questions.length) * 100),
        totalCorrect,
        totalQuestions: questions.length,
        totalPoints: totalCorrect * 5,
        maxPoints: questions.length * 5,
      }
    } else {
      let totalScore = 0
      answers.forEach((answer, index) => {
        if (questions[index] && questions[index].scoring) {
          totalScore += questions[index].scoring[answer] || 0
        }
      })

      return {
        [testType === "adhd" ? "adhdScore" : testType === "asd" ? "asdScore" : "anxietyScore"]: totalScore,
        totalQuestions: questions.length,
        maxScore: testType === "adhd" ? 120 : testType === "asd" ? 30 : 90,
      }
    }
  }

  const resetTest = () => {
    updateState({ currentView: "home", testType: null, testResults: null })
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    updateState({ user: null })
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const handleAuth = (e: any) => {
    e.preventDefault()
    setIsAuthenticated(true)
    setShowAuthModal(false)

    // Update user state with form data
    updateState({
      user: {
        ...appState.user,
        name: authForm.name || authForm.email.split("@")[0],
        email: authForm.email,
      },
    })

    toast({
      title: "Authentication successful",
      description: `Welcome, ${authForm.name || authForm.email}!`,
    })

    // If user just completed a test, redirect to results
    if (appState.testResults && appState.currentView === "success") {
      updateState({ currentView: "free-results" })
    }
  }

  // Home Page Component
  const HomePage = () => (
    <div className="min-h-screen bg-white">
      <header className="container mx-auto px-4 py-6 border-b border-slate-100">
        <nav className="flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => updateState({ currentView: "home" })}
          >
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-sm">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">DataVine.ai</h1>
              <p className="text-xs text-slate-600">Scientifically Validated Assessments</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <UserProfileDropdown
                userName={appState.user?.name || "User"}
                userEmail={appState.user?.email || "user@example.com"}
                onLogout={handleLogout}
                onNavigate={(view) => {
                  // Handle navigation to different views
                  if (view === "dashboard") {
                    window.location.href = "/dashboard"
                  } else if (view === "profile") {
                    window.location.href = "/profile"
                  } else if (view === "settings") {
                    window.location.href = "/settings"
                  } else if (view === "billing") {
                    window.location.href = "/billing"
                  }
                }}
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setAuthMode("signin")
                    setShowAuthModal(true)
                  }}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    setAuthMode("signup")
                    setShowAuthModal(true)
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Unlock Your Potential with DataVine.ai</h1>
          <p className="text-slate-700 text-lg mb-12">
            Discover your strengths and areas for growth with our scientifically validated assessments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl">IQ Assessment</CardTitle>
                <CardDescription>
                  Measure your cognitive abilities and identify your intellectual strengths.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() => updateState({ currentView: "gender", testType: "iq" })}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Start Assessment
                </Button>
              </CardFooter>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl">ADHD Assessment</CardTitle>
                <CardDescription>
                  Evaluate symptoms of ADHD and gain insights into your attention and hyperactivity levels.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() => updateState({ currentView: "gender", testType: "adhd" })}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Start Assessment
                </Button>
              </CardFooter>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl">ASD Assessment</CardTitle>
                <CardDescription>
                  Screen for Autism Spectrum Disorder and understand your social communication and interaction patterns.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() => updateState({ currentView: "gender", testType: "asd" })}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Start Assessment
                </Button>
              </CardFooter>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl">Anxiety Assessment</CardTitle>
                <CardDescription>
                  Assess your anxiety levels and identify potential triggers and coping mechanisms.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() => updateState({ currentView: "gender", testType: "anxiety" })}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Start Assessment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        <footer className="border-t border-slate-100 py-12 mt-32">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-slate-900 p-2 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900">DataVine.ai</h4>
              </div>
              <p className="text-slate-600 text-sm">
                Scientifically validated assessments to help you understand your cognitive abilities and mental health.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Assessments</h4>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => updateState({ currentView: "gender", testType: "iq" })}
                    className="hover:text-slate-900 transition-colors"
                  >
                    IQ Assessment
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => updateState({ currentView: "gender", testType: "adhd" })}
                    className="hover:text-slate-900 transition-colors"
                  >
                    ADHD Assessment
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => updateState({ currentView: "gender", testType: "asd" })}
                    className="hover:text-slate-900 transition-colors"
                  >
                    ASD Assessment
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => updateState({ currentView: "gender", testType: "anxiety" })}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Anxiety Assessment
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li>
                  <a href="/about" className="hover:text-slate-900 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/research" className="hover:text-slate-900 transition-colors">
                    Research
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-slate-900 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-slate-900 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Support</h4>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li>
                  <a href="/contact" className="hover:text-slate-900 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <span className="text-slate-500">1-800-DATAVINE</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 mt-8 pt-8 text-center">
            <p className="text-slate-500 text-sm">
              © 2024 DataVine.ai. All rights reserved. | Made with ❤️ for better mental health awareness.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )

  // Gender Selection Page Component
  const GenderSelectionPage = () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-slate-50 rounded-xl shadow-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Select Your Gender</h2>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => updateState({ currentView: "test" })}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            Male
          </Button>
          <Button
            onClick={() => updateState({ currentView: "test" })}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            Female
          </Button>
          <Button
            onClick={() => updateState({ currentView: "test" })}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            Other
          </Button>
        </div>
        <Button
          onClick={() => updateState({ currentView: "home" })}
          variant="ghost"
          className="mt-6 w-full text-slate-600"
        >
          ← Go Back
        </Button>
      </div>
    </div>
  )

  // Test Page Component
  const TestPage = () => {
    const questions = getCurrentQuestions()
    const currentQuestion = questions[questionIndex]

    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-slate-50 rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Assessment in Progress</h2>
          <p className="text-slate-700 text-center mb-8">
            Please answer the following questions to the best of your ability.
          </p>
          <Progress value={((questionIndex + 1) / questions.length) * 100} className="mb-4" />

          {appState.testType === "iq" && currentQuestion.image && (
            <div className="mb-4">
              <img
                src={currentQuestion.image || "/placeholder.svg"}
                alt={`Question ${questionIndex + 1}`}
                className="mx-auto max-w-full h-auto"
              />
            </div>
          )}

          <p className="text-slate-800 font-semibold mb-4">{currentQuestion.question}</p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={answers[questionIndex] === index ? "default" : "outline"}
                className={`w-full justify-start ${
                  answers[questionIndex] === index ? "bg-slate-900 hover:bg-slate-800 text-white" : ""
                }`}
                onClick={() => handleAnswer(index)}
              >
                {option}
              </Button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={handleBack} className="text-slate-600">
              ← Go Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={answers[questionIndex] === undefined}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              {questionIndex === questions.length - 1 ? "Get Results" : "Next Question →"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Success Page Component
  const SuccessPage = () => {
    // Check if user is authenticated before showing results
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="max-w-md w-full p-6 bg-slate-50 rounded-xl shadow-lg border border-slate-200 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Assessment Completed!</h2>
            <p className="text-slate-700 mb-6">
              Please sign in or create an account to view your results and track your progress.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setAuthMode("signin")
                  setShowAuthModal(true)
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
              >
                Sign In to View Results
              </Button>
              <Button
                onClick={() => {
                  setAuthMode("signup")
                  setShowAuthModal(true)
                }}
                variant="outline"
                className="w-full"
              >
                Create Account
              </Button>
            </div>
            <Button
              onClick={() => updateState({ currentView: "home" })}
              variant="ghost"
              className="w-full mt-4 text-slate-600"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-slate-50 rounded-xl shadow-lg border border-slate-200 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assessment Completed!</h2>
          <p className="text-slate-700 mb-6">
            Thank you for completing the assessment. Your results are being processed.
          </p>
          <Button
            onClick={() => updateState({ currentView: "free-results" })}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
          >
            View Results
          </Button>
        </div>
      </div>
    )
  }

  // Free Results Page Component
  const FreeResultsPage = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="max-w-md w-full p-6 bg-slate-50 rounded-xl shadow-lg border border-slate-200 text-center">
            <div className="bg-slate-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Brain className="h-8 w-8 text-slate-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Sign In Required</h2>
            <p className="text-slate-700 mb-6">
              Please sign in or create an account to view your assessment results and track your progress over time.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setAuthMode("signin")
                  setShowAuthModal(true)
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  setAuthMode("signup")
                  setShowAuthModal(true)
                }}
                variant="outline"
                className="w-full"
              >
                Create Account
              </Button>
            </div>
            <Button
              onClick={() => updateState({ currentView: "home" })}
              variant="ghost"
              className="w-full mt-4 text-slate-600"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      )
    }

    const { testType } = appState
    const isIQTest = testType === "iq"
    const isADHDTest = testType === "adhd"
    const isASDTest = testType === "asd"
    const isAnxietyTest = testType === "anxiety"

    const handleSecretClick = () => {
      setShowCouponField(true)
    }

    const handleCouponApply = () => {
      if (couponCode === "DATAVINE20") {
        updateState({ user: { ...appState.user, usedCoupon: true } })
        toast({
          title: "Coupon Applied!",
          description: "You have successfully applied the coupon.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Coupon",
          description: "Please enter a valid coupon code.",
        })
      }
    }

    if (!appState.testResults) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600">No test results available.</p>
            <Button onClick={() => updateState({ currentView: "home" })} className="mt-4">
              Take Assessment
            </Button>
          </div>
        </div>
      )
    }

    let classification: any = {}
    let score = 0

    if (isIQTest && appState.testResults.iqScore) {
      score = appState.testResults.iqScore
      classification = getIQClassification(score)
    } else if (isADHDTest && appState.testResults.adhdScore !== undefined) {
      score = appState.testResults.adhdScore
      classification = getADHDAssessment(score)
    } else if (isASDTest && appState.testResults.asdScore !== undefined) {
      score = appState.testResults.asdScore
      classification = getASDAssessment(score)
    } else if (isAnxietyTest && appState.testResults.anxietyScore !== undefined) {
      score = appState.testResults.anxietyScore
      classification = getAnxietyAssessment(score)
    }

    return (
      <div className="min-h-screen bg-white">
        <header className="container mx-auto px-4 py-6 border-b border-slate-100">
          <nav className="flex items-center justify-between">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => updateState({ currentView: "home" })}
            >
              <div className="bg-slate-900 p-2.5 rounded-xl shadow-sm">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">DataVine.ai</h1>
                <p className="text-xs text-slate-600">Scientifically Validated Assessments</p>
              </div>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-50 rounded-xl p-8 mb-8 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 p-3 rounded-full">
                    <Brain className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{getTestTitle()} Results</h2>
                    <p className="text-sm text-slate-600">Here's a summary of your assessment results</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={handleGoHome} className="text-slate-600">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {isIQTest && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-900">{appState.testResults.iqScore}</div>
                      <div className="text-sm text-slate-600">IQ Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-900">{appState.testResults.percentile}%</div>
                      <div className="text-sm text-slate-600">Percentile</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">IQ Classification</h3>
                    <div
                      className={`px-3 py-1.5 rounded-full font-medium text-sm w-fit ${classification.color} ${classification.bgColor}`}
                    >
                      {classification.category} ({classification.range})
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div>
                      <div className="text-lg font-semibold text-slate-900 mb-2">Correct Answers</div>
                      <Progress value={appState.testResults.accuracy} />
                      <div className="text-sm text-slate-600 mt-2">
                        {appState.testResults.totalCorrect} out of {appState.testResults.totalQuestions}
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-slate-900 mb-2">Points Earned</div>
                      <Progress value={(appState.testResults.totalPoints / appState.testResults.maxPoints) * 100} />
                      <div className="text-sm text-slate-600 mt-2">
                        {appState.testResults.totalPoints} out of {appState.testResults.maxPoints}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {(isADHDTest || isASDTest || isAnxietyTest) && (
                <>
                  <div className="text-center mb-8">
                    <div className="text-4xl font-bold text-slate-900">
                      {score} / {classification.maxScore}
                    </div>
                    <div className="text-sm text-slate-600">Total Score</div>
                  </div>

                  <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Assessment Insights</h3>
                    <div
                      className={`px-3 py-1.5 rounded-full font-medium text-sm w-fit ${classification.color} ${classification.bgColor}`}
                    >
                      {classification.category}
                    </div>
                    <p className="text-slate-700 mt-3">{classification.description}</p>
                  </div>
                </>
              )}

              <div className="space-y-4">
                {appState.user?.usedCoupon ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4">
                    <p className="font-medium">
                      <CheckCircle className="inline-block h-5 w-5 mr-2 align-middle" />
                      Coupon applied! You're viewing detailed results.
                    </p>
                  </div>
                ) : appState.user?.hasPaid ? (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4">
                    <p className="font-medium">
                      <CheckCircle className="inline-block h-5 w-5 mr-2 align-middle" />
                      Thank you for your purchase! You're viewing detailed results.
                    </p>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => updateState({ currentView: "payment" })}
                      className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      Unlock Detailed Results
                    </Button>
                    {showCouponField && (
                      <div className="flex items-center space-x-3">
                        <Input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="h-12"
                        />
                        <Button onClick={handleCouponApply}>Apply</Button>
                      </div>
                    )}
                    <Button variant="ghost" onClick={handleSecretClick} className="w-full text-slate-600">
                      I have a coupon code
                    </Button>
                  </>
                )}
                <Button onClick={resetTest} variant="outline" className="w-full h-12 bg-transparent">
                  Take Another Assessment
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Payment Page Component
  const PaymentPage = () => (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-slate-900 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Unlock Detailed Results</h1>
          <p className="text-slate-600">Upgrade to Premium for in-depth analysis and personalized insights</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-semibold text-slate-900">Premium Access</div>
            <div className="text-xl font-bold text-slate-900">$9.99/month</div>
          </div>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li>Unlimited assessments</li>
            <li>Detailed analysis reports</li>
            <li>Personalized recommendations</li>
            <li>Progress tracking & history</li>
          </ul>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handlePayment}
            disabled={paymentProcessing}
            className={`w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white ${
              paymentProcessing ? "cursor-not-allowed" : ""
            }`}
          >
            {paymentProcessing ? (
              <>
                Processing Payment...
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Complete Payment"
            )}
          </Button>
          <Button
            onClick={() => updateState({ currentView: "free-results" })}
            variant="outline"
            className="w-full h-12 bg-transparent"
          >
            ← Back to Results
          </Button>
        </div>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Secure payment powered by Stripe. Your information is encrypted and protected.
        </p>
      </div>
    </div>
  )

  // Detailed Results Page Component
  const DetailedResultsPage = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="max-w-md w-full p-6 bg-slate-50 rounded-xl shadow-lg border border-slate-200 text-center">
            <div className="bg-slate-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Brain className="h-8 w-8 text-slate-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Sign In Required</h2>
            <p className="text-slate-700 mb-6">
              Please sign in or create an account to access detailed assessment results.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setAuthMode("signin")
                  setShowAuthModal(true)
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  setAuthMode("signup")
                  setShowAuthModal(true)
                }}
                variant="outline"
                className="w-full"
              >
                Create Account
              </Button>
            </div>
            <Button
              onClick={() => updateState({ currentView: "home" })}
              variant="ghost"
              className="w-full mt-4 text-slate-600"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      )
    }

    const { testType } = appState
    const isIQTest = testType === "iq"
    const isADHDTest = testType === "adhd"
    const isASDTest = testType === "asd"
    const isAnxietyTest = testType === "anxiety"

    if (!appState.testResults) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600">No test results available.</p>
            <Button onClick={resetTest} className="mt-4">
              Take Assessment
            </Button>
          </div>
        </div>
      )
    }

    let classification: any = {}
    let score = 0

    if (isIQTest && appState.testResults.iqScore) {
      score = appState.testResults.iqScore
      classification = getIQClassification(score)
    } else if (isADHDTest && appState.testResults.adhdScore !== undefined) {
      score = appState.testResults.adhdScore
      classification = getADHDAssessment(score)
    } else if (isASDTest && appState.testResults.asdScore !== undefined) {
      score = appState.testResults.asdScore
      classification = getASDAssessment(score)
    } else if (isAnxietyTest && appState.testResults.anxietyScore !== undefined) {
      score = appState.testResults.anxietyScore
      classification = getAnxietyAssessment(score)
    }

    return (
      <div className="min-h-screen bg-white">
        <header className="container mx-auto px-4 py-6 border-b border-slate-100">
          <nav className="flex items-center justify-between">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => updateState({ currentView: "home" })}
            >
              <div className="bg-slate-900 p-2.5 rounded-xl shadow-sm">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">DataVine.ai</h1>
                <p className="text-xs text-slate-600">Scientifically Validated Assessments</p>
              </div>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-50 rounded-xl p-8 mb-8 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 p-3 rounded-full">
                    <Brain className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{getTestTitle()} Results</h2>
                    <p className="text-sm text-slate-600">Here's a detailed analysis of your assessment results</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={handleGoHome} className="text-slate-600">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {isIQTest && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-900">{appState.testResults.iqScore}</div>
                      <div className="text-sm text-slate-600">IQ Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-900">{appState.testResults.percentile}%</div>
                      <div className="text-sm text-slate-600">Percentile</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">IQ Classification</h3>
                    <div
                      className={`px-3 py-1.5 rounded-full font-medium text-sm w-fit ${classification.color} ${classification.bgColor}`}
                    >
                      {classification.category} ({classification.range})
                    </div>
                    <p className="text-slate-700 mt-3">
                      Based on your score, you fall into the "{classification.category}" category, indicating your
                      cognitive abilities are within the range of {classification.range}.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div>
                      <div className="text-lg font-semibold text-slate-900 mb-2">Correct Answers</div>
                      <Progress value={appState.testResults.accuracy} />
                      <div className="text-sm text-slate-600 mt-2">
                        {appState.testResults.totalCorrect} out of {appState.testResults.totalQuestions}
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-slate-900 mb-2">Points Earned</div>
                      <Progress value={(appState.testResults.totalPoints / appState.testResults.maxPoints) * 100} />
                      <div className="text-sm text-slate-600 mt-2">
                        {appState.testResults.totalPoints} out of {appState.testResults.maxPoints}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Detailed Analysis</h3>
                    <p className="text-slate-700">
                      Your performance indicates strong pattern recognition and logical reasoning skills. Focus on
                      continuous learning and challenging yourself with complex problems to further enhance your
                      cognitive abilities.
                    </p>
                  </div>
                </>
              )}

              {(isADHDTest || isASDTest || isAnxietyTest) && (
                <>
                  <div className="text-center mb-8">
                    <div className="text-4xl font-bold text-slate-900">
                      {score} / {classification.maxScore}
                    </div>
                    <div className="text-sm text-slate-600">Total Score</div>
                  </div>

                  <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Assessment Insights</h3>
                    <div
                      className={`px-3 py-1.5 rounded-full font-medium text-sm w-fit ${classification.color} ${classification.bgColor}`}
                    >
                      {classification.category}
                    </div>
                    <p className="text-slate-700 mt-3">{classification.description}</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Personalized Recommendations</h3>
                    <ul className="list-disc list-inside text-slate-700 space-y-2">
                      {isADHDTest && (
                        <>
                          <li>Consider strategies for improving focus and time management.</li>
                          <li>Explore mindfulness techniques to reduce restlessness.</li>
                          <li>Consult with a healthcare professional for further evaluation.</li>
                        </>
                      )}
                      {isASDTest && (
                        <>
                          <li>Identify and leverage your unique strengths and interests.</li>
                          <li>Create a structured environment to reduce sensory overload.</li>
                          <li>Seek support groups or therapy to improve social communication skills.</li>
                        </>
                      )}
                      {isAnxietyTest && (
                        <>
                          <li>Practice relaxation techniques such as deep breathing and meditation.</li>
                          <li>Engage in regular physical activity to reduce tension.</li>
                          <li>Seek therapy or counseling to address underlying anxiety triggers.</li>
                        </>
                      )}
                    </ul>
                  </div>
                </>
              )}

              <div className="space-y-4">
                <Button onClick={resetTest} variant="outline" className="w-full h-12 bg-transparent">
                  Take Another Assessment
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Authentication Modal Component
  const AuthModal = () =>
    showAuthModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{authMode === "signin" ? "Sign In" : "Sign Up"}</h2>
            <Button
              variant="ghost"
              onClick={() => setShowAuthModal(false)}
              className="text-slate-500 hover:text-slate-700"
            >
              ✕
            </Button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === "signup" && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className="w-full"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full"
                required
              />
            </div>

            {authMode === "signup" && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={authForm.confirmPassword}
                  onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                  className="w-full"
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white">
              {authMode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {authMode === "signin" ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
                className="ml-1 text-slate-900 font-medium hover:underline"
              >
                {authMode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    )

  // Conditional rendering based on appState
  let content
  switch (appState.currentView) {
    case "home":
      content = <HomePage />
      break
    case "gender":
      content = <GenderSelectionPage />
      break
    case "test":
      content = <TestPage />
      break
    case "success":
      content = <SuccessPage />
      break
    case "free-results":
      content = <FreeResultsPage />
      break
    case "payment":
      content = <PaymentPage />
      break
    case "detailed-results":
      content = <DetailedResultsPage />
      break
    default:
      content = <HomePage />
  }

  return (
    <>
      <AuthModal />
      {content}
    </>
  )
}
