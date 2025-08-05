"use client"

import { useState, useEffect, useRef } from "react"
import { Brain, CheckCircle, CreditCard, Home, Loader2, Upload, Camera, X, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { PaymentForm } from "@/components/payment-form"
import { apiClient } from "@/lib/api"

// IQ Test Questions - 30 comprehensive questions with improved visuals
const IQ_QUESTIONS = [
  {
    id: 1,
    type: "visual",
    category: "Pattern Recognition",
    question: "Which shape completes the pattern?",
    visualType: "pattern_sequence",
    pattern: [
      { shape: "circle", color: "blue", size: "small" },
      { shape: "square", color: "red", size: "medium" },
      { shape: "triangle", color: "green", size: "large" },
      { shape: "?", color: "?", size: "?" },
    ],
    options: [
      { shape: "circle", color: "yellow", size: "small", label: "A" },
      { shape: "diamond", color: "blue", size: "large", label: "B" },
      { shape: "circle", color: "purple", size: "large", label: "C" },
      { shape: "square", color: "blue", size: "small", label: "D" },
    ],
    correctAnswer: "C",
    difficulty: "easy",
    explanation:
      "The pattern shows increasing size with different shapes and colors. The missing piece should be a large circle with a new color.",
    cognitiveArea: "Spatial Intelligence",
  },
  {
    id: 2,
    type: "numerical",
    category: "Number Series",
    question: "What number comes next in the series: 2, 6, 18, 54, ?",
    options: ["108", "162", "216", "324"],
    correctAnswer: "162",
    difficulty: "medium",
    explanation: "Each number is multiplied by 3 to get the next number (2×3=6, 6×3=18, 18×3=54, 54×3=162).",
    cognitiveArea: "Mathematical Intelligence",
  },
  {
    id: 3,
    type: "verbal",
    category: "Analogies",
    question: "Book is to Reading as Fork is to:",
    options: ["Eating", "Kitchen", "Spoon", "Food"],
    correctAnswer: "Eating",
    difficulty: "easy",
    explanation: "A book is used for reading, just as a fork is used for eating.",
    cognitiveArea: "Verbal Intelligence",
  },
  {
    id: 4,
    type: "visual",
    category: "Pattern Completion",
    question: "Which shape completes the pattern sequence?",
    visualType: "pattern_sequence",
    pattern: [
      { shape: "circle", color: "blue", size: "small" },
      { shape: "square", color: "red", size: "medium" },
      { shape: "triangle", color: "green", size: "large" },
      { shape: "?", color: "?", size: "?" },
    ],
    options: [
      { shape: "diamond", color: "purple", size: "small", label: "A" },
      { shape: "circle", color: "yellow", size: "large", label: "B" },
      { shape: "square", color: "orange", size: "small", label: "C" },
      { shape: "triangle", color: "cyan", size: "medium", label: "D" },
    ],
    correctAnswer: "B",
    difficulty: "medium",
    explanation: "The pattern alternates between shapes and colors, with increasing size. The missing piece should be a large circle with a new color.",
    cognitiveArea: "Pattern Recognition",
  },
  {
    id: 5,
    type: "logical",
    category: "Logical Reasoning",
    question: "If all roses are flowers, and some flowers are red, which statement must be true?",
    options: ["All roses are red", "Some roses are red", "No roses are red", "Some roses might be red"],
    correctAnswer: "Some roses might be red",
    difficulty: "hard",
    explanation: "We cannot determine if roses are red from the given information, but it's possible.",
    cognitiveArea: "Logical Intelligence",
  },
  {
    id: 6,
    type: "numerical",
    category: "Mathematical Problem",
    question: "If 3x + 7 = 22, what is the value of x?",
    options: ["3", "5", "7", "9"],
    correctAnswer: "5",
    difficulty: "medium",
    explanation: "3x + 7 = 22, so 3x = 15, therefore x = 5.",
    cognitiveArea: "Mathematical Intelligence",
  },
  {
    id: 7,
    type: "visual",
    category: "Visual Analogies",
    question: "Which shape completes the analogy?",
    visualType: "pattern_sequence",
    pattern: [
      { shape: "circle", color: "blue", size: "medium" },
      { shape: "square", color: "red", size: "medium" },
      { shape: "triangle", color: "green", size: "medium" },
      { shape: "?", color: "?", size: "?" },
    ],
    options: [
      { shape: "diamond", color: "purple", size: "medium", label: "A" },
      { shape: "circle", color: "yellow", size: "medium", label: "B" },
      { shape: "square", color: "orange", size: "medium", label: "C" },
      { shape: "triangle", color: "cyan", size: "medium", label: "D" },
    ],
    correctAnswer: "A",
    difficulty: "medium",
    explanation: "The pattern cycles through different shapes with different colors. The missing piece should be a diamond with a new color.",
    cognitiveArea: "Visual Reasoning",
  },
  {
    id: 8,
    type: "verbal",
    category: "Word Relationships",
    question: "Which word is most similar in meaning to 'Ephemeral'?",
    options: ["Permanent", "Temporary", "Beautiful", "Complex"],
    correctAnswer: "Temporary",
    difficulty: "hard",
    explanation: "Ephemeral means lasting for a very short time, which is synonymous with temporary.",
    cognitiveArea: "Verbal Intelligence",
  },
  {
    id: 9,
    type: "numerical",
    category: "Number Patterns",
    question: "What is the next number in the sequence: 1, 4, 9, 16, 25, ?",
    options: ["30", "36", "42", "49"],
    correctAnswer: "36",
    difficulty: "easy",
    explanation: "These are perfect squares: 1², 2², 3², 4², 5², 6² = 36.",
    cognitiveArea: "Mathematical Intelligence",
  },
  {
    id: 10,
    type: "visual",
    category: "Shape Recognition",
    question: "Which shape is different from the others?",
    visualType: "pattern_sequence",
    pattern: [
      { shape: "circle", color: "blue", size: "medium" },
      { shape: "circle", color: "blue", size: "medium" },
      { shape: "square", color: "blue", size: "medium" },
      { shape: "circle", color: "blue", size: "medium" },
    ],
    options: [
      { shape: "circle", color: "blue", size: "medium", label: "A" },
      { shape: "square", color: "blue", size: "medium", label: "B" },
      { shape: "triangle", color: "blue", size: "medium", label: "C" },
      { shape: "diamond", color: "blue", size: "medium", label: "D" },
    ],
    correctAnswer: "B",
    difficulty: "easy",
    explanation: "The pattern shows three circles and one square. The square is the odd one out.",
    cognitiveArea: "Visual Discrimination",
  },
  {
    id: 11,
    type: "logical",
    category: "Deductive Reasoning",
    question: "All birds can fly. Penguins are birds. Therefore:",
    options: ["Penguins can fly", "The premise is incorrect", "Penguins are not birds", "Birds cannot fly"],
    correctAnswer: "The premise is incorrect",
    difficulty: "medium",
    explanation: "The logical conclusion reveals that the initial premise 'all birds can fly' is false.",
    cognitiveArea: "Logical Intelligence",
  },
  {
    id: 12,
    type: "numerical",
    category: "Arithmetic Reasoning",
    question: "A train travels 120 miles in 2 hours. At this rate, how far will it travel in 5 hours?",
    options: ["240 miles", "300 miles", "360 miles", "480 miles"],
    correctAnswer: "300 miles",
    difficulty: "easy",
    explanation: "Speed = 120/2 = 60 mph. Distance in 5 hours = 60 × 5 = 300 miles.",
    cognitiveArea: "Mathematical Intelligence",
  },
  {
    id: 13,
    type: "visual",
    category: "Abstract Reasoning",
    question: "Which figure continues the logical sequence?",
    visualType: "sequence",
    sequence: [
      { shapes: [{ type: "circle", color: "red" }] },
      {
        shapes: [
          { type: "circle", color: "red" },
          { type: "square", color: "blue" },
        ],
      },
      {
        shapes: [
          { type: "square", color: "blue" },
          { type: "triangle", color: "green" },
        ],
      },
      { shapes: [{ type: "?", color: "?" }] },
    ],
    options: [
      {
        shapes: [
          { type: "triangle", color: "green" },
          { type: "diamond", color: "yellow" },
        ],
        label: "A",
      },
      { shapes: [{ type: "circle", color: "red" }], label: "B" },
      { shapes: [{ type: "triangle", color: "green" }], label: "C" },
      { shapes: [{ type: "diamond", color: "yellow" }], label: "D" },
    ],
    correctAnswer: "A",
    difficulty: "medium",
    explanation:
      "The sequence shows transformation where the second shape becomes the first, and a new shape is added.",
    cognitiveArea: "Abstract Intelligence",
  },
  {
    id: 14,
    type: "verbal",
    category: "Synonyms",
    question: "Which word means the same as 'Meticulous'?",
    options: ["Careless", "Detailed", "Quick", "Loud"],
    correctAnswer: "Detailed",
    difficulty: "medium",
    explanation: "Meticulous means showing great attention to detail; very careful and precise.",
    cognitiveArea: "Verbal Intelligence",
  },
  {
    id: 15,
    type: "numerical",
    category: "Percentage",
    question: "What is 15% of 240?",
    options: ["24", "36", "48", "60"],
    correctAnswer: "36",
    difficulty: "easy",
    explanation: "15% of 240 = 0.15 × 240 = 36.",
    cognitiveArea: "Mathematical Intelligence",
  },
  {
    id: 16,
    type: "logical",
    category: "Pattern Logic",
    question: "In a certain code, FLOWER is written as EKNVDQ. How is GARDEN written?",
    options: ["FZQCDM", "FZQCDK", "FZQCDL", "FZQCDN"],
    correctAnswer: "FZQCDN",
    difficulty: "hard",
    explanation: "Each letter is replaced by the letter that comes one position before it in the alphabet.",
    cognitiveArea: "Logical Intelligence",
  },
  {
    id: 17,
    type: "visual",
    category: "Mirror Images",
    question: "Which is the mirror image of the given figure?",
    visualType: "mirror",
    baseShape: { type: "arrow_right", color: "blue" },
    options: [
      { type: "arrow_left", color: "blue", label: "A" },
      { type: "arrow_up", color: "blue", label: "B" },
      { type: "arrow_down", color: "blue", label: "C" },
      { type: "arrow_right", color: "red", label: "D" },
    ],
    correctAnswer: "A",
    difficulty: "easy",
    explanation: "The mirror image of a right-pointing arrow is a left-pointing arrow.",
    cognitiveArea: "Spatial Intelligence",
  },
  {
    id: 18,
    type: "numerical",
    category: "Fractions",
    question: "What is 3/4 + 2/3?",
    options: ["5/7", "17/12", "5/12", "1"],
    correctAnswer: "17/12",
    difficulty: "medium",
    explanation: "3/4 + 2/3 = 9/12 + 8/12 = 17/12.",
    cognitiveArea: "Mathematical Intelligence",
  },
  {
    id: 19,
    type: "verbal",
    category: "Antonyms",
    question: "What is the opposite of 'Abundant'?",
    options: ["Plentiful", "Scarce", "Multiple", "Rich"],
    correctAnswer: "Scarce",
    difficulty: "easy",
    explanation: "Abundant means existing in large quantities; scarce means insufficient or in short supply.",
    cognitiveArea: "Verbal Intelligence",
  },
  {
    id: 20,
    type: "logical",
    category: "Series Completion",
    question: "Complete the series: AZ, BY, CX, DW, ?",
    options: ["EV", "FU", "EW", "FV"],
    correctAnswer: "EV",
    difficulty: "medium",
    explanation: "First letter increases by 1, second letter decreases by 1 in the alphabet.",
    cognitiveArea: "Logical Intelligence",
  },
  {
    id: 21,
    type: "visual",
    category: "Color Pattern Recognition",
    question: "Which color comes next in the sequence?",
    visualType: "pattern_sequence",
    pattern: [
      { shape: "circle", color: "red", size: "medium" },
      { shape: "circle", color: "blue", size: "medium" },
      { shape: "circle", color: "green", size: "medium" },
      { shape: "circle", color: "?", size: "medium" },
    ],
    options: [
      { shape: "circle", color: "yellow", size: "medium", label: "A" },
      { shape: "circle", color: "purple", size: "medium", label: "B" },
      { shape: "circle", color: "orange", size: "medium", label: "C" },
      { shape: "circle", color: "cyan", size: "medium", label: "D" },
    ],
    correctAnswer: "A",
    difficulty: "easy",
    explanation: "The pattern cycles through primary and secondary colors: red, blue, green, yellow.",
    cognitiveArea: "Visual Pattern Recognition",
  },
  {
    id: 22,
    type: "numerical",
    category: "Algebra",
    question: "If 2x - 5 = 11, what is x + 3?",
    options: ["8", "11", "13", "16"],
    correctAnswer: "11",
    difficulty: "medium",
    explanation: "2x - 5 = 11, so 2x = 16, x = 8. Therefore x + 3 = 8 + 3 = 11.",
    cognitiveArea: "Mathematical Intelligence",
  },
  {
    id: 23,
    type: "verbal",
    category: "Analogies",
    question: "Doctor is to Hospital as Teacher is to:",
    options: ["Student", "School", "Book", "Lesson"],
    correctAnswer: "School",
    difficulty: "easy",
    explanation: "A doctor works in a hospital, just as a teacher works in a school.",
    cognitiveArea: "Verbal Intelligence",
  },
  {
    id: 24,
    type: "logical",
    category: "Classification",
    question: "Which one doesn't belong in this group: Rose, Tulip, Carrot, Lily?",
    options: ["Rose", "Tulip", "Carrot", "Lily"],
    correctAnswer: "Carrot",
    difficulty: "easy",
    explanation: "Rose, Tulip, and Lily are flowers; Carrot is a vegetable.",
    cognitiveArea: "Logical Intelligence",
  },
  {
    id: 25,
    type: "numerical",
    category: "Geometry",
    question: "What is the area of a rectangle with length 8 and width 5?",
    options: ["13", "26", "40", "80"],
    correctAnswer: "40",
    difficulty: "easy",
    explanation: "Area of rectangle = length × width = 8 × 5 = 40.",
    cognitiveArea: "Mathematical Intelligence",
  },
  {
    id: 26,
    type: "visual",
    category: "Pattern Recognition",
    question: "What comes next in this pattern?",
    visualType: "pattern_sequence",
    pattern: [
      { shape: "triangle", color: "red", size: "small", rotation: 0 },
      { shape: "triangle", color: "blue", size: "medium", rotation: 90 },
      { shape: "triangle", color: "green", size: "large", rotation: 180 },
      { shape: "?", color: "?", size: "?", rotation: "?" },
    ],
    options: [
      { shape: "triangle", color: "yellow", size: "small", rotation: 270, label: "A" },
      { shape: "square", color: "red", size: "large", rotation: 0, label: "B" },
      { shape: "triangle", color: "purple", size: "medium", rotation: 90, label: "C" },
      { shape: "circle", color: "orange", size: "small", rotation: 0, label: "D" },
    ],
    correctAnswer: "A",
    difficulty: "hard",
    explanation:
      "Pattern shows triangles with changing colors, increasing then decreasing size, and 90° rotation increments.",
    cognitiveArea: "Spatial Intelligence",
  },
  {
    id: 27,
    type: "verbal",
    category: "Word Completion",
    question: "Complete the word: _ _ A C E",
    options: ["SPACE", "PLACE", "TRACE", "All of the above"],
    correctAnswer: "All of the above",
    difficulty: "medium",
    explanation: "SPACE, PLACE, and TRACE all fit the pattern _ _ A C E.",
    cognitiveArea: "Verbal Intelligence",
  },
  {
    id: 28,
    type: "numerical",
    category: "Time and Distance",
    question: "If a car travels at 60 mph for 2.5 hours, how far does it travel?",
    options: ["120 miles", "150 miles", "180 miles", "200 miles"],
    correctAnswer: "150 miles",
    difficulty: "easy",
    explanation: "Distance = Speed × Time = 60 × 2.5 = 150 miles.",
    cognitiveArea: "Mathematical Intelligence",
  },
  {
    id: 29,
    type: "logical",
    category: "Conditional Reasoning",
    question: "If it rains, then the ground gets wet. The ground is not wet. What can we conclude?",
    options: ["It rained", "It did not rain", "The ground is dry", "Cannot determine"],
    correctAnswer: "It did not rain",
    difficulty: "medium",
    explanation: "This is modus tollens: If P then Q, not Q, therefore not P.",
    cognitiveArea: "Logical Intelligence",
  },
  {
    id: 30,
    type: "logical",
    category: "Mathematical Reasoning",
    question: "If a train travels at 60 mph for 2 hours, then at 40 mph for 3 hours, what is the average speed for the entire journey?",
    options: ["45 mph", "48 mph", "50 mph", "52 mph"],
    correctAnswer: "B",
    difficulty: "medium",
    explanation: "Total distance = (60 × 2) + (40 × 3) = 120 + 120 = 240 miles. Total time = 2 + 3 = 5 hours. Average speed = 240 ÷ 5 = 48 mph.",
    cognitiveArea: "Mathematical Intelligence & Problem Solving",
  },
]

// ADHD Assessment Questions - 30 questions based on ASRS-v1.1 and DSM-5 criteria
const ADHD_QUESTIONS = [
  {
    id: 1,
    type: "attention",
    category: "Inattention",
    question:
      "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Difficulty completing tasks is a common symptom of ADHD inattention.",
  },
  {
    id: 2,
    type: "attention",
    category: "Organization",
    question:
      "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Problems with organization are characteristic of ADHD.",
  },
  {
    id: 3,
    type: "attention",
    category: "Memory",
    question: "How often do you have problems remembering appointments or obligations?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Forgetfulness and memory issues are common in ADHD.",
  },
  {
    id: 4,
    type: "attention",
    category: "Procrastination",
    question: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Procrastination on mentally demanding tasks is typical in ADHD.",
  },
  {
    id: 5,
    type: "hyperactivity",
    category: "Restlessness",
    question: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Physical restlessness is a hallmark of ADHD hyperactivity.",
  },
  {
    id: 6,
    type: "hyperactivity",
    category: "Activity Level",
    question: "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Feeling driven by internal restlessness is common in ADHD.",
  },
  {
    id: 7,
    type: "attention",
    category: "Concentration",
    question:
      "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Difficulty maintaining attention in conversations is an ADHD symptom.",
  },
  {
    id: 8,
    type: "attention",
    category: "Focus",
    question: "How often do you have trouble staying focused on activities or tasks?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Sustained attention difficulties are core to ADHD diagnosis.",
  },
  {
    id: 9,
    type: "impulsivity",
    category: "Decision Making",
    question: "How often do you make careless mistakes when you have to work on a boring or difficult project?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Careless errors due to inattention are common in ADHD.",
  },
  {
    id: 10,
    type: "attention",
    category: "Task Management",
    question: "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Difficulty with sustained attention on routine tasks is typical in ADHD.",
  },
  {
    id: 11,
    type: "impulsivity",
    category: "Interrupting",
    question: "How often do you interrupt others when they are busy?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Impulsive interrupting behavior is a sign of ADHD impulsivity.",
  },
  {
    id: 12,
    type: "hyperactivity",
    category: "Sitting Still",
    question:
      "How often do you leave your seat in meetings or other situations where you are expected to remain seated?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Difficulty remaining seated is a hyperactivity symptom.",
  },
  {
    id: 13,
    type: "attention",
    category: "Listening",
    question:
      "How often do you have trouble listening to what people are saying, even when they are speaking directly to you?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Listening difficulties reflect attention problems in ADHD.",
  },
  {
    id: 14,
    type: "impulsivity",
    category: "Patience",
    question: "How often do you have difficulty waiting your turn in situations when turn taking is required?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Impatience and difficulty waiting are impulsivity symptoms.",
  },
  {
    id: 15,
    type: "attention",
    category: "Following Through",
    question: "How often do you fail to follow through on instructions and fail to finish work?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Difficulty following through on tasks is an attention deficit symptom.",
  },
  {
    id: 16,
    type: "hyperactivity",
    category: "Restlessness",
    question: "How often do you feel restless or fidgety?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Internal restlessness is a common hyperactivity symptom.",
  },
  {
    id: 17,
    type: "attention",
    category: "Details",
    question: "How often do you fail to give close attention to details or make careless mistakes?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Attention to detail problems are characteristic of ADHD inattention.",
  },
  {
    id: 18,
    type: "impulsivity",
    category: "Blurting Out",
    question: "How often do you blurt out answers before questions have been completed?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Impulsive responding is a key symptom of ADHD.",
  },
  {
    id: 19,
    type: "attention",
    category: "Losing Things",
    question: "How often do you lose things necessary for tasks or activities?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Frequently losing items is an organizational symptom of ADHD.",
  },
  {
    id: 20,
    type: "attention",
    category: "Distractibility",
    question: "How often are you easily distracted by external stimuli?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Easy distractibility is a core attention deficit symptom.",
  },
  {
    id: 21,
    type: "hyperactivity",
    category: "Talking",
    question: "How often do you talk excessively?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Excessive talking can be a hyperactivity symptom in ADHD.",
  },
  {
    id: 22,
    type: "attention",
    category: "Mental Effort",
    question: "How often do you avoid tasks that require sustained mental effort?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Avoidance of mentally demanding tasks is common in ADHD.",
  },
  {
    id: 23,
    type: "impulsivity",
    category: "Decision Making",
    question: "How often do you make decisions impulsively?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Impulsive decision-making is a hallmark of ADHD impulsivity.",
  },
  {
    id: 24,
    type: "attention",
    category: "Forgetfulness",
    question: "How often are you forgetful in daily activities?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Daily forgetfulness is a common attention deficit symptom.",
  },
  {
    id: 25,
    type: "hyperactivity",
    category: "Energy Level",
    question: "How often do you have difficulty engaging in leisure activities quietly?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Difficulty with quiet activities reflects hyperactivity symptoms.",
  },
  {
    id: 26,
    type: "impulsivity",
    category: "Interrupting",
    question: "How often do you interrupt or intrude on others' conversations or games?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Intrusive behavior is an impulsivity symptom of ADHD.",
  },
  {
    id: 27,
    type: "attention",
    category: "Task Switching",
    question: "How often do you have trouble organizing tasks and activities?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Organizational difficulties are executive function problems in ADHD.",
  },
  {
    id: 28,
    type: "hyperactivity",
    category: "Physical Activity",
    question: "How often do you feel like you're 'on the go' or act as if 'driven by a motor'?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Feeling constantly driven is a hyperactivity symptom.",
  },
  {
    id: 29,
    type: "attention",
    category: "Instructions",
    question: "How often do you have difficulty following through on instructions?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Problems following instructions reflect attention and executive function issues.",
  },
  {
    id: 30,
    type: "impulsivity",
    category: "Self-Control",
    question: "How often do you have trouble controlling your behavior in social situations?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    scoring: [0, 1, 2, 3, 4],
    explanation: "Social self-control difficulties are related to ADHD impulsivity.",
  },
]

// Autism Spectrum Quotient - 30 Questions (Extended AQ)
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
    question: "When I'm reading a story, I find it difficult to work out the characters' intentions.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Difficulty understanding character motivations.",
  },
  {
    id: 8,
    question: "I like to collect information about categories of things.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Special interests and collecting information are common in ASD.",
  },
  {
    id: 9,
    question: "I find it easy to work out what someone is thinking or feeling just by looking at their face.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Difficulty reading facial expressions.",
  },
  {
    id: 10,
    question: "I find it difficult to work out people's intentions.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Difficulty understanding others' intentions.",
  },
  {
    id: 11,
    question: "New situations make me anxious.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Anxiety about new situations is common in ASD.",
  },
  {
    id: 12,
    question: "I enjoy meeting new people.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Social interaction preferences in ASD.",
  },
  {
    id: 13,
    question: "I am a good diplomat.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Diplomatic skills require social understanding.",
  },
  {
    id: 14,
    question: "I am not very good at remembering people's date of birth.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Memory for social details may vary in ASD.",
  },
  {
    id: 15,
    question: "I find it very easy to play games with children that involve pretending.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Pretend play can be challenging in ASD.",
  },
  {
    id: 16,
    question: "I prefer to do things with others rather than on my own.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Social preferences in ASD.",
  },
  {
    id: 17,
    question: "I prefer to do things the same way over and over again.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Preference for routine and repetition in ASD.",
  },
  {
    id: 18,
    question: "If I try to imagine something, I find it very easy to create a picture in my mind.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Imagination abilities may vary in ASD.",
  },
  {
    id: 19,
    question: "I frequently get so strongly absorbed in one thing that I lose sight of other things.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Intense focus on interests is common in ASD.",
  },
  {
    id: 20,
    question: "I find it easy to do more than one thing at once.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Multitasking difficulties in ASD.",
  },
  {
    id: 21,
    question: "When I talk on the phone, I'm not sure when it's my turn to speak.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Difficulty with conversational turn-taking.",
  },
  {
    id: 22,
    question: "I enjoy doing things spontaneously.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Preference for routine over spontaneity in ASD.",
  },
  {
    id: 23,
    question: "I am often the last to understand the point of a joke.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Difficulty understanding humor and social context.",
  },
  {
    id: 24,
    question: "I find it easy to work out what someone is thinking or feeling just by looking at their face.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Challenges with reading facial expressions.",
  },
  {
    id: 25,
    question: "If there is an interruption, I can switch back to what I was doing very quickly.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Difficulty with task switching after interruptions.",
  },
  {
    id: 26,
    question: "I am good at social chit-chat.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Difficulty with casual social interactions.",
  },
  {
    id: 27,
    question: "People often tell me that I keep going on and on about the same thing.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Tendency to perseverate on topics of interest.",
  },
  {
    id: 28,
    question: "When I was young, I used to enjoy playing games involving pretending with other children.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Early pretend play development in ASD.",
  },
  {
    id: 29,
    question: "I like to plan any activities I participate in carefully.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [0, 0, 1, 1],
    explanation: "Need for planning and structure in ASD.",
  },
  {
    id: 30,
    question: "I find social situations easy.",
    options: ["Definitely Disagree", "Slightly Disagree", "Slightly Agree", "Definitely Agree"],
    scoring: [1, 1, 0, 0],
    explanation: "Social situations are typically challenging in ASD.",
  },
]

// Anxiety Assessment Questions - 30 questions based on GAD-7, Beck Anxiety Inventory, and other validated scales
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

// Enhanced Visual Question Renderer Component with improved styling
const VisualQuestionRenderer = ({ question, selectedAnswer, onAnswerSelect }: any) => {
  const renderShape = (shapeData: any, size = 50) => {
    const { shape, type, color, filled, pattern, orientation = 0, rotation = 0 } = shapeData
    const shapeType = shape || type

    const getShapeColor = (colorName: string) => {
      const colors: any = {
        red: "#ef4444",
        blue: "#3b82f6",
        green: "#22c55e",
        yellow: "#eab308",
        purple: "#a855f7",
        orange: "#f97316",
        pink: "#ec4899",
        gray: "#6b7280",
        cyan: "#06b6d4",
        indigo: "#6366f1",
      }
      return colors[colorName] || colorName || "#6b7280"
    }

    const finalRotation = rotation || orientation || 0
    const shapeColor = getShapeColor(color)

    const shapeStyle = {
      width: size,
      height: size,
      backgroundColor: filled !== false ? shapeColor : "transparent",
      border: `3px solid ${shapeColor}`,
      display: "inline-block",
      margin: "4px",
      transform: `rotate(${finalRotation}deg)`,
      transition: "all 0.2s ease",
    }

    switch (shapeType) {
      case "circle":
        return <div style={{ ...shapeStyle, borderRadius: "50%" }} />
      case "square":
        return <div style={shapeStyle} />
      case "triangle":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderBottom: `${size}px solid ${filled !== false ? shapeColor : "transparent"}`,
              borderTop: filled === false ? `3px solid ${shapeColor}` : "none",
              margin: "4px",
              transform: `rotate(${finalRotation}deg)`,
              transition: "all 0.2s ease",
            }}
          />
        )
      case "diamond":
        return (
          <div
            style={{
              ...shapeStyle,
              transform: `rotate(45deg) rotate(${finalRotation}deg)`,
              width: size * 0.8,
              height: size * 0.8,
            }}
          />
        )
      case "L_shape":
        return (
          <div
            style={{
              width: size,
              height: size,
              position: "relative",
              transform: `rotate(${finalRotation}deg)`,
              margin: "4px",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                width: size * 0.7,
                height: size * 0.35,
                backgroundColor: shapeColor,
                position: "absolute",
                top: 0,
                left: 0,
                border: `2px solid ${shapeColor}`,
              }}
            />
            <div
              style={{
                width: size * 0.35,
                height: size * 0.7,
                backgroundColor: shapeColor,
                position: "absolute",
                bottom: 0,
                left: 0,
                border: `2px solid ${shapeColor}`,
              }}
            />
          </div>
        )
      case "T_shape":
        return (
          <div
            style={{
              width: size,
              height: size,
              position: "relative",
              transform: `rotate(${finalRotation}deg)`,
              margin: "4px",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                width: size,
                height: size * 0.35,
                backgroundColor: shapeColor,
                position: "absolute",
                top: 0,
                left: 0,
                border: `2px solid ${shapeColor}`,
              }}
            />
            <div
              style={{
                width: size * 0.35,
                height: size * 0.7,
                backgroundColor: shapeColor,
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                border: `2px solid ${shapeColor}`,
              }}
            />
          </div>
        )
      case "arrow_right":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: `${size / 2}px solid transparent`,
              borderBottom: `${size / 2}px solid transparent`,
              borderLeft: `${size}px solid ${shapeColor}`,
              margin: "4px",
              transform: `rotate(${finalRotation}deg)`,
              transition: "all 0.2s ease",
            }}
          />
        )
      case "arrow_left":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: `${size / 2}px solid transparent`,
              borderBottom: `${size / 2}px solid transparent`,
              borderRight: `${size}px solid ${shapeColor}`,
              margin: "4px",
              transform: `rotate(${finalRotation}deg)`,
              transition: "all 0.2s ease",
            }}
          />
        )
      case "arrow_up":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderBottom: `${size}px solid ${shapeColor}`,
              margin: "4px",
              transform: `rotate(${finalRotation}deg)`,
              transition: "all 0.2s ease",
            }}
          />
        )
      case "arrow_down":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderTop: `${size}px solid ${shapeColor}`,
              margin: "4px",
              transform: `rotate(${finalRotation}deg)`,
              transition: "all 0.2s ease",
            }}
          />
        )
      case "?":
        return (
          <div
            style={{
              ...shapeStyle,
              backgroundColor: "#f8fafc",
              border: "3px dashed #94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: size * 0.5,
              fontWeight: "bold",
              color: "#64748b",
            }}
          >
            ?
          </div>
        )
      default:
        return <div style={shapeStyle} />
    }
  }

  const renderVisualQuestion = () => {
    switch (question.visualType) {
      case "pattern_sequence":
        return (
          <div className="mb-4">
            <div className="flex justify-center items-center space-x-4 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
              {question.pattern.map((item: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="bg-white p-2 rounded-md shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    {renderShape(item, 45)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "matrix_3x3":
        return (
          <div className="mb-4">
            <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200 max-w-xs mx-auto">
              {question.matrix.flat().map((cell: any, index: number) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-white border border-slate-300 rounded-md flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                >
                  {renderShape(cell, 30)}
                </div>
              ))}
            </div>
          </div>
        )

      case "rotation":
        return (
          <div className="mb-4">
            <div className="text-center p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600 mb-2 font-medium">Original Shape:</p>
              <div className="bg-white p-3 rounded-md shadow-sm border border-slate-200 inline-block">
                {renderShape(question.baseShape, 60)}
              </div>
            </div>
          </div>
        )

      case "puzzle_completion":
        return (
          <div className="mb-4">
            <div className="grid grid-cols-3 gap-1 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200 max-w-xs mx-auto">
              {question.puzzle.grid.flat().map((cell: any, index: number) => (
                <div
                  key={index}
                  className="w-12 h-12 bg-white border border-slate-300 rounded-md flex items-center justify-center shadow-sm"
                >
                  {cell === "?" ? (
                    renderShape({ shape: "?", color: "gray" }, 25)
                  ) : (
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor:
                          cell === "filled"
                            ? question.puzzle.colors[index % question.puzzle.colors.length]
                            : "transparent",
                        border: cell === "empty" ? "1px solid #cbd5e1" : "none",
                        borderRadius: "2px",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case "sequence":
        return (
          <div className="mb-4">
            <div className="flex justify-center items-center space-x-4 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
              {question.sequence.map((step: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="bg-white p-2 rounded-md shadow-sm border border-slate-200 min-w-[60px] min-h-[60px] flex items-center justify-center">
                    <div className="flex justify-center space-x-1">
                      {step.shapes.map((shape: any, shapeIndex: number) => (
                        <div key={shapeIndex}>{renderShape(shape, 25)}</div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Step {index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "mirror":
        return (
          <div className="mb-8">
            <div className="text-center p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200">
              <p className="text-sm text-slate-600 mb-4 font-medium">Find the mirror image:</p>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 inline-block">
                {renderShape(question.baseShape, 80)}
              </div>
            </div>
          </div>
        )

      case "cube_net":
        return (
          <div className="mb-8">
            <div className="text-center p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200">
              <p className="text-sm text-slate-600 mb-4 font-medium">Cube Net:</p>
              <div className="inline-block bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <div className="grid grid-cols-3 gap-1">
                  {question.net.pattern.map((row: any, rowIndex: number) =>
                    row.map((cell: any, colIndex: number) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-12 h-12 border-2 flex items-center justify-center text-sm font-bold ${
                          cell ? "bg-blue-100 border-blue-300 text-blue-800" : "border-transparent"
                        }`}
                      >
                        {cell}
                      </div>
                    )),
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case "cube_counting":
        return (
          <div className="mb-8">
            <div className="text-center p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200">
              <p className="text-sm text-slate-600 mb-4 font-medium">3D Structure (count all cubes):</p>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 inline-block">
                <div className="text-6xl">🧊</div>
                <p className="text-xs text-slate-500 mt-2">3D Cube Structure</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderOptions = () => {
    if (question.type === "visual" && question.options) {
      // Check if options have text property (for text-based visual questions)
      const hasTextOptions = question.options[0] && typeof question.options[0] === 'object' && question.options[0].text;
      
      if (hasTextOptions) {
        return (
          <div className="space-y-2">
            {question.options.map((option: any, index: number) => (
              <Button
                key={index}
                variant={selectedAnswer === option.label ? "default" : "outline"}
                className={`w-full justify-start text-left p-3 h-auto min-h-[2.5rem] transition-all duration-200 ${
                  selectedAnswer === option.label
                    ? "bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
                    : "hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm"
                }`}
                onClick={() => onAnswerSelect(option.label)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === option.label ? "border-white bg-white" : "border-slate-300"
                    }`}
                  >
                    {selectedAnswer === option.label && <div className="w-2.5 h-2.5 rounded-full bg-slate-900"></div>}
                  </div>
                  <span className="text-sm leading-relaxed">{option.text}</span>
                </div>
              </Button>
            ))}
          </div>
        )
      }
      
      return (
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option: any, index: number) => (
            <Button
              key={index}
              variant={selectedAnswer === option.label ? "default" : "outline"}
              className={`h-20 flex flex-col items-center justify-center space-y-2 transition-all duration-200 ${
                selectedAnswer === option.label
                  ? "bg-slate-900 hover:bg-slate-800 text-white shadow-lg scale-105"
                  : "hover:bg-slate-50 hover:border-slate-300 hover:shadow-md"
              }`}
              onClick={() => onAnswerSelect(option.label)}
            >
              <div className="flex items-center justify-center">
                {option.shapes ? (
                  <div className="flex space-x-1">
                    {option.shapes.map((shape: any, shapeIndex: number) => (
                      <div key={shapeIndex}>{renderShape(shape, 25)}</div>
                    ))}
                  </div>
                ) : (
                  renderShape(option, 30)
                )}
              </div>
              <span className="font-bold text-base">{option.label}</span>
            </Button>
          ))}
        </div>
      )
    }

    // Regular text options for non-visual questions
    return (
      <div className="space-y-2">
        {question.options.map((option: string, index: number) => {
          // Handle both string and number selectedAnswer types
          const isSelected = selectedAnswer === index || selectedAnswer === option
          
          return (
            <Button
              key={index}
              variant={isSelected ? "default" : "outline"}
              className={`w-full justify-start text-left p-3 h-auto min-h-[2.5rem] transition-all duration-200 ${
                isSelected
                  ? "bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
                  : "hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm"
              }`}
              onClick={() => onAnswerSelect(option)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-white bg-white" : "border-slate-300"
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-slate-900"></div>}
                </div>
                <span className="text-sm leading-relaxed">{option}</span>
              </div>
            </Button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {question.type === "visual" && renderVisualQuestion()}
      {renderOptions()}
    </div>
  )
}

const getIQClassification = (score: number) => {
  if (score >= 140) {
    return {
      category: "Genius or near genius",
      range: "Above 140",
      color: "text-red-500",
      bgColor: "bg-red-100",
    }
  } else if (score >= 120) {
    return {
      category: "Very superior intelligence",
      range: "120-139",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    }
  } else if (score >= 110) {
    return {
      category: "Superior intelligence",
      range: "110-119",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    }
  } else if (score >= 90) {
    return {
      category: "Normal or average intelligence",
      range: "90-109",
      color: "text-green-500",
      bgColor: "bg-green-100",
    }
  } else if (score >= 80) {
    return {
      category: "Dullness",
      range: "80-89",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    }
  } else if (score >= 70) {
    return {
      category: "Borderline deficiency",
      range: "70-79",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    }
  } else {
    return {
      category: "Deficiency",
      range: "Below 70",
      color: "text-gray-500",
      bgColor: "bg-gray-100",
    }
  }
}

const getADHDAssessment = (score: number) => {
  if (score >= 60) {
    return {
      category: "Likely ADHD",
      description:
        "Your score suggests a high likelihood of ADHD. It is recommended to consult with a healthcare professional for a comprehensive evaluation.",
      color: "text-red-500",
      bgColor: "bg-red-100",
    }
  } else if (score >= 40) {
    return {
      category: "Possible ADHD",
      description:
        "Your score indicates a possibility of ADHD. Further assessment and consultation with a healthcare provider are advisable.",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    }
  } else {
    return {
      category: "Unlikely ADHD",
      description:
        "Your score suggests a low likelihood of ADHD. However, if you have concerns, consider discussing them with a healthcare professional.",
      color: "text-green-500",
      bgColor: "bg-green-100",
    }
  }
}

const getASDAssessment = (score: number) => {
  if (score >= 18) {
    return {
      category: "Likely ASD",
      description:
        "Your score suggests a high likelihood of ASD. It is recommended to consult with a healthcare professional for a comprehensive evaluation.",
      color: "text-red-500",
      bgColor: "bg-red-100",
    }
  } else if (score >= 12) {
    return {
      category: "Possible ASD",
      description:
        "Your score indicates a possibility of ASD. Further assessment and consultation with a healthcare provider are advisable.",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    }
  } else {
    return {
      category: "Unlikely ASD",
      description:
        "Your score suggests a low likelihood of ASD. However, if you have concerns, consider discussing them with a healthcare professional.",
      color: "text-green-500",
      bgColor: "bg-green-100",
    }
  }
}

const getAnxietyAssessment = (score: number) => {
  if (score >= 20) {
    return {
      category: "Severe Anxiety",
      description:
        "Your score indicates severe anxiety. It is highly recommended to seek professional help from a mental health provider.",
      color: "text-red-500",
      bgColor: "bg-red-100",
    }
  } else if (score >= 15) {
    return {
      category: "Moderate Anxiety",
      description:
        "Your score suggests moderate anxiety. Consider seeking therapy or counseling to manage your symptoms.",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    }
  } else if (score >= 10) {
    return {
      category: "Mild Anxiety",
      description:
        "Your score indicates mild anxiety. Lifestyle changes and stress management techniques may be helpful.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    }
  } else {
    return {
      category: "Minimal Anxiety",
      description:
        "Your score suggests minimal anxiety. Continue to practice self-care and maintain a healthy lifestyle.",
      color: "text-green-500",
      bgColor: "bg-green-100",
    }
  }
}

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup" | "forgot">("signin")
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const [authErrors, setAuthErrors] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    general: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [forgotEmailSent, setForgotEmailSent] = useState(false)
  const [appState, setAppState] = useState({
    currentView: "home",
    testType: null,
    testResults: null,
    user: {
      name: "",
      email: "",
      phone: "",
      profilePicture: null,
      usedCoupon: false,
      hasPaid: false,
      subscription: "Free",
      subscriptionExpiry: "N/A",
      assessmentHistory: [],
    },
  } as any)

  const [answers, setAnswers] = useState<(string | number)[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [showCouponField, setShowCouponField] = useState(false)
  const [couponCode, setCouponCode] = useState("")

  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      try {
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

        // Check for stored authentication state
        const storedAuth = localStorage.getItem("datavine_auth")
        const storedUser = localStorage.getItem("datavine_user")

        if (storedAuth === "true" && storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            setIsAuthenticated(true)
            updateState({ user: userData })
            
            // Set the token for API calls
            if (userData.token) {
              apiClient.setToken(userData.token)
            }
            
            // Refresh user data from backend to ensure we have the latest profile picture
            try {
              const userResponse = await apiClient.getCurrentUser()
              if (userResponse.success) {
                const refreshedUserData = {
                  ...userResponse.data,
                  assessmentHistory: userResponse.data.assessmentHistory || [],
                  subscription: userResponse.data.subscription?.type || "Free",
                  subscriptionExpiry: userResponse.data.subscription?.endDate || "N/A",
                  usedCoupon: userResponse.data.usedCoupon || false,
                  hasPaid: userResponse.data.hasPaid || false,
                }
                updateState({ user: refreshedUserData })
                localStorage.setItem("datavine_user", JSON.stringify(refreshedUserData))
              }
            } catch (error) {
              console.error('Error refreshing user data:', error)
              // Keep the stored data if refresh fails
            }
          } catch (error) {
            // Clear invalid stored data
            localStorage.removeItem("datavine_auth")
            localStorage.removeItem("datavine_user")
          }
        }
      } catch (error) {
        console.error('App initialization error:', error)
      } finally {
        setIsInitializing(false)
      }
    }

    initializeApp()
  }, [])

  const updateState = (newState: any) => {
    setAppState((prevState: any) => ({ ...prevState, ...newState }))
  }

  const getCurrentQuestions = () => {
    switch (appState.testType) {
      case "adhd":
        return ADHD_QUESTIONS
      case "asd":
        return ASD_QUESTIONS
      case "anxiety":
        return ANXIETY_QUESTIONS
      case "iq":
        return IQ_QUESTIONS
      default:
        return IQ_QUESTIONS // Default to IQ questions if testType is not recognized
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

  const handlePayment = async () => {
    // This function is now handled by the PaymentForm component
    // The PaymentForm component handles the full Stripe payment flow
    console.log('Payment handled by PaymentForm component')
  }

  const handleAnswer = (answer: string | number) => {
    const newAnswers = [...answers]
    const questions = getCurrentQuestions()
    const currentQuestion = questions[questionIndex]
    
    // For ASD, ADHD, and Anxiety questions, we need to convert the answer text to the corresponding index
    if (currentQuestion && currentQuestion.options && 'scoring' in currentQuestion) {
      const answerIndex = currentQuestion.options.indexOf(answer as string)
      newAnswers[questionIndex] = answerIndex
    } else {
      // For IQ questions, store the answer as is (could be string label or number)
      newAnswers[questionIndex] = answer
    }
    
    setAnswers(newAnswers)
  }

  const [isSubmittingTest, setIsSubmittingTest] = useState(false)

  const handleNext = async () => {
    const questions = getCurrentQuestions()
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1)
    } else {
      setIsSubmittingTest(true)
      try {
        const testResults = calculateResults()
        updateState({ currentView: "success", testResults })
        
        // Save results to database if user is authenticated
        await saveAssessmentResult(testResults)
      } catch (error) {
        console.error('Error submitting test:', error)
        toast({
          title: "Submission Error",
          description: "Failed to submit test results. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmittingTest(false)
      }
    }
  }

  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1)
    } else {
      updateState({ currentView: "gender" })
    }
  }

  const calculateResults = () => {
    const { testType } = appState
    const questions = getCurrentQuestions()

    if (testType === "iq") {
      let totalCorrect = 0
      questions.forEach((question: any, index) => {
        if (question.correctAnswer === answers[index]) {
          totalCorrect++
        }
      })

      const iqScore = Math.round(70 + (totalCorrect / questions.length) * 80)
      const percentile = Math.round((iqScore / 160) * 100)

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
        const question: any = questions[index]
        if (question && question.scoring && typeof answer === "number") {
          totalScore += question.scoring[answer] || 0
        }
      })

      let maxScore = 0
      if (testType === "adhd") maxScore = ADHD_QUESTIONS.reduce((sum, q) => sum + Math.max(...q.scoring), 0)
      if (testType === "asd") maxScore = ASD_QUESTIONS.reduce((sum, q) => sum + Math.max(...q.scoring), 0)
      if (testType === "anxiety") maxScore = ANXIETY_QUESTIONS.reduce((sum, q) => sum + Math.max(...q.scoring), 0)

      return {
        score: totalScore,
        totalQuestions: questions.length,
        maxScore,
      }
    }
  }

  const saveAssessmentResult = async (results: any) => {
    if (!isAuthenticated) return

    try {
      const assessmentData = {
        testType: appState.testType as "iq" | "adhd" | "asd" | "anxiety",
        score: results.iqScore || results.score,
        maxScore: results.maxPoints || results.maxScore,
        answers: answers.map((answer, index) => ({
          questionId: index + 1,
          selectedAnswer: String(answer),
          isCorrect: appState.testType === "iq" ? 
            (getCurrentQuestions()[index] as any)?.correctAnswer === answer : 
            false,
          timeSpent: 0 // Could be enhanced to track actual time
        })),
        detailedResults: results
      }

      await apiClient.saveAssessmentResult(assessmentData)
    } catch (error) {
      console.error('Failed to save assessment result:', error)
    }
  }

  const resetTest = () => {
    setAnswers([])
    setQuestionIndex(0)
    updateState({ currentView: "home", testType: null, testResults: null })
  }

  const handleLogout = async () => {
    // Only call logout API if user is authenticated
    if (isAuthenticated) {
      try {
        // Call logout API
        await apiClient.logout()
      } catch (error) {
        console.error('Logout error:', error)
        // Continue with logout even if API call fails
      }
    }

    setIsAuthenticated(false)
    updateState({ user: null })

    // Clear authentication state from localStorage
    localStorage.removeItem("datavine_auth")
    localStorage.removeItem("datavine_user")
    localStorage.removeItem("datavine_token")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  // Profile picture upload functionality
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      try {
        // Upload to backend
        const response = await apiClient.uploadProfilePicture(file)
        
        if (response.success) {
          const updatedUser = { ...appState.user, profilePicture: response.data.url }
          updateState({ user: updatedUser })
          localStorage.setItem("datavine_user", JSON.stringify(updatedUser))

          toast({
            title: "Profile picture updated",
            description: "Your profile picture has been successfully updated.",
          })
        } else {
          toast({
            title: "Upload Failed",
            description: response.message || "Failed to upload profile picture.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Profile picture upload error:', error)
        toast({
          title: "Upload Failed",
          description: "An error occurred while uploading your profile picture.",
          variant: "destructive",
        })
      }
    }
  }

  const handleRemoveProfilePicture = async () => {
    try {
      // Call backend to remove profile picture
      const response = await apiClient.removeProfilePicture();
      
      if (response.success) {
        const updatedUser = { ...appState.user, profilePicture: null }
        updateState({ user: updatedUser })
        
        // Save to localStorage
        localStorage.setItem("datavine_user", JSON.stringify(updatedUser))
        
        toast({
          title: "Profile picture removed",
          description: "Your profile picture has been removed.",
        })
      } else {
        toast({
          title: "Remove Failed",
          description: response.message || "Failed to remove profile picture.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Profile picture removal error:', error)
      toast({
        title: "Remove Failed",
        description: "An error occurred while removing your profile picture.",
        variant: "destructive",
      })
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return ""
  }

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters long"
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter"
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter"
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number"
    return ""
  }

  const validateName = (name: string): string => {
    if (!name) return "Name is required"
    if (name.length < 2) return "Name must be at least 2 characters long"
    if (name.length > 50) return "Name must be less than 50 characters"
    return ""
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) return "Please confirm your password"
    if (password !== confirmPassword) return "Passwords do not match"
    return ""
  }

  const clearAuthErrors = () => {
    setAuthErrors({
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
      general: ""
    })
  }

  // Real-time validation handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setAuthForm({ ...authForm, email })
    if (email && authErrors.email) {
      const error = validateEmail(email)
      setAuthErrors(prev => ({ ...prev, email: error }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    setAuthForm({ ...authForm, password })
    if (password && authErrors.password) {
      const error = validatePassword(password)
      setAuthErrors(prev => ({ ...prev, password: error }))
    }
    // Also validate confirm password if it exists
    if (authForm.confirmPassword && authErrors.confirmPassword) {
      const error = validateConfirmPassword(password, authForm.confirmPassword)
      setAuthErrors(prev => ({ ...prev, confirmPassword: error }))
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setAuthForm({ ...authForm, name })
    if (name && authErrors.name) {
      const error = validateName(name)
      setAuthErrors(prev => ({ ...prev, name: error }))
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value
    setAuthForm({ ...authForm, confirmPassword })
    if (confirmPassword && authErrors.confirmPassword) {
      const error = validateConfirmPassword(authForm.password, confirmPassword)
      setAuthErrors(prev => ({ ...prev, confirmPassword: error }))
    }
  }

  const handleAuthModeChange = (mode: "signin" | "signup" | "forgot") => {
    setAuthMode(mode)
    clearAuthErrors()
    setForgotEmailSent(false)
    setAuthForm({
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    })
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    clearAuthErrors()

    const emailError = validateEmail(authForm.email)
    if (emailError) {
      setAuthErrors(prev => ({ ...prev, email: emailError }))
      setIsSubmitting(false)
      return
    }

    try {
      const response = await apiClient.forgotPassword(authForm.email)
      if (response.success) {
        setForgotEmailSent(true)
        toast({
          title: "Reset Email Sent",
          description: "Check your email for password reset instructions.",
        })
      } else {
        setAuthErrors(prev => ({ ...prev, general: response.message || "Failed to send reset email" }))
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setAuthErrors(prev => ({ ...prev, general: "Failed to send reset email. Please try again." }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      // For development, simulate Google login with demo data
      // In production, this would use real Google OAuth
      const demoGoogleData = {
        email: "demo.user@gmail.com",
        name: "Demo User",
        googleId: "demo_google_id_" + Date.now()
      };

      const response = await apiClient.googleLogin(
        demoGoogleData.email,
        demoGoogleData.name,
        demoGoogleData.googleId
      );

      if (response.success) {
        // Set the token
        apiClient.setToken(response.data.token);
        
        // Get complete user profile
        const userResponse = await apiClient.getCurrentUser();
        if (userResponse.success) {
          const userData = {
            ...userResponse.data,
            assessmentHistory: userResponse.data.assessmentHistory || [],
            subscription: userResponse.data.subscription?.type || "Free",
            subscriptionExpiry: userResponse.data.subscription?.endDate || "N/A",
            usedCoupon: userResponse.data.usedCoupon || false,
            hasPaid: userResponse.data.hasPaid || false,
          };
          
          // Update app state
          updateState({
            user: userData,
            isAuthenticated: true,
            showAuthModal: false
          });
          
          // Store in localStorage
          localStorage.setItem('datavine_token', response.data.token);
          localStorage.setItem('datavine_user', JSON.stringify(userData));
          
          toast({
            title: "Welcome!",
            description: `Successfully signed in with Google as ${userData.name}`,
          });
          
          // Clear form data after successful login
          setTimeout(() => {
            setAuthForm({
              email: "",
              password: "",
              name: "",
              confirmPassword: "",
            });
          }, 100);
        }
      } else {
        toast({
          title: "Google Login Failed",
          description: response.message || "Failed to sign in with Google",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Google login error:', error)
      toast({
        title: "Login Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAuth = async (e: any) => {
    e.preventDefault()
    
    // Clear previous errors
    clearAuthErrors()
    
    // Validate form fields
    const emailError = validateEmail(authForm.email)
    const passwordError = validatePassword(authForm.password)
    
    let nameError = ""
    let confirmPasswordError = ""
    
    if (authMode === "signup") {
      nameError = validateName(authForm.name)
      confirmPasswordError = validateConfirmPassword(authForm.password, authForm.confirmPassword)
    }
    
    // Set errors if any validation failed
    const newErrors = {
      email: emailError,
      password: passwordError,
      name: nameError,
      confirmPassword: confirmPasswordError,
      general: ""
    }
    
    setAuthErrors(newErrors)
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== "")
    if (hasErrors) {
      return
    }
    
    setIsSubmitting(true)

    try {
      let response;
      
      if (authMode === "signup") {
        // Register new user
        response = await apiClient.register({
          name: authForm.name || authForm.email.split("@")[0],
          email: authForm.email,
          password: authForm.password
        })
      } else {
        // Sign in existing user
        response = await apiClient.login({
          email: authForm.email,
          password: authForm.password
        })
      }

      if (response.success) {
        // For login, try to get the user's complete profile from backend
        let userData;
        
        if (authMode === "signin") {
          try {
            // Set the token first
            apiClient.setToken(response.data.token);
            
            // Get complete user profile from backend
            const userResponse = await apiClient.getCurrentUser();
            if (userResponse.success) {
              userData = {
                ...userResponse.data,
                assessmentHistory: userResponse.data.assessmentHistory || [],
                subscription: userResponse.data.subscription?.type || "Free",
                subscriptionExpiry: userResponse.data.subscription?.endDate || "N/A",
                usedCoupon: userResponse.data.usedCoupon || false,
                hasPaid: userResponse.data.hasPaid || false,
              };
            } else {
              // Fallback to basic user data if getCurrentUser fails
              userData = {
                ...appState.user,
                name: response.data.user?.name || authForm.email.split("@")[0],
                email: authForm.email,
                profilePicture: response.data.user?.profilePicture || null,
                assessmentHistory: response.data.user?.assessmentHistory || [],
                subscription: response.data.user?.subscription?.type || "Free",
                subscriptionExpiry: response.data.user?.subscription?.endDate || "N/A",
                usedCoupon: response.data.user?.usedCoupon || false,
                hasPaid: response.data.user?.hasPaid || false,
              };
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            // Fallback to response data
            userData = {
              ...appState.user,
              name: response.data.user?.name || authForm.email.split("@")[0],
              email: authForm.email,
              profilePicture: response.data.user?.profilePicture || null,
              assessmentHistory: response.data.user?.assessmentHistory || [],
              subscription: response.data.user?.subscription?.type || "Free",
              subscriptionExpiry: response.data.user?.subscription?.endDate || "N/A",
              usedCoupon: response.data.user?.usedCoupon || false,
              hasPaid: response.data.user?.hasPaid || false,
            };
          }
        } else {
          // For signup, use the response data
          userData = {
            ...appState.user,
            name: authForm.name || authForm.email.split("@")[0],
            email: authForm.email,
            profilePicture: response.data.user?.profilePicture || null,
            assessmentHistory: response.data.user?.assessmentHistory || [],
            subscription: response.data.user?.subscription?.type || "Free",
            subscriptionExpiry: response.data.user?.subscription?.endDate || "N/A",
            usedCoupon: response.data.user?.usedCoupon || false,
            hasPaid: response.data.user?.hasPaid || false,
          };
        }

        setIsAuthenticated(true)
        setShowAuthModal(false)
        updateState({ user: userData })

        // Clear sensitive form data after successful auth (with small delay)
        setTimeout(() => {
          setAuthForm({
            email: "",
            password: "",
            name: "",
            confirmPassword: "",
          })
        }, 100)

        // Store authentication state in localStorage
        localStorage.setItem("datavine_auth", "true")
        localStorage.setItem("datavine_user", JSON.stringify(userData))

        toast({
          title: "Authentication successful",
          description: `Welcome, ${authForm.name || authForm.email}!`,
        })

        if (appState.testResults && appState.currentView === "success") {
          updateState({ currentView: "free-results" })
        }
      } else {
        setAuthErrors(prev => ({
          ...prev,
          general: response.message || "Authentication failed. Please check your credentials."
        }))
        toast({
          title: "Authentication Failed",
          description: response.message || "An error occurred during authentication.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setAuthErrors(prev => ({
        ...prev,
        general: "Network error. Please check your connection and try again."
      }))
      toast({
        title: "Authentication Failed",
        description: "An error occurred during authentication. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Common header component for authenticated users
  const AuthenticatedHeader = () => (
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
              profilePicture={appState.user?.profilePicture}
              onLogout={handleLogout}
              onNavigate={(view) => {
                if (view === "dashboard") updateState({ currentView: "dashboard" })
                else if (view === "profile") updateState({ currentView: "profile" })
                else if (view === "settings") updateState({ currentView: "settings" })
                else if (view === "billing") updateState({ currentView: "billing" })
              }}
            />
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => {
                  handleAuthModeChange("signin")
                  setShowAuthModal(true)
                }}
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  handleAuthModeChange("signup")
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
  )

  const HomePage = () => (
    <div className="min-h-screen bg-white">
      <AuthenticatedHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">FREE Professional Cognitive Assessments</h1>
          <p className="text-slate-700 text-lg mb-6">
            Take <strong>completely FREE</strong> IQ tests, ADHD screenings, and autism assessments online. 
            One of the few companies offering professional cognitive testing at no cost.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">✓ No credit card required</span>
              <span className="text-green-600 mx-2">•</span>
              <span className="text-green-800 font-medium">✓ No hidden fees</span>
              <span className="text-green-600 mx-2">•</span>
              <span className="text-green-800 font-medium">✓ Instant results</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">FREE IQ Assessment</CardTitle>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">FREE</span>
                </div>
                <CardDescription>
                  Measure your cognitive abilities and identify your intellectual strengths. 
                  <strong>Completely free with instant results.</strong>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() => updateState({ currentView: "gender", testType: "iq" })}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Start FREE Assessment
                </Button>
              </CardFooter>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">FREE ADHD Assessment</CardTitle>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">FREE</span>
                </div>
                <CardDescription>
                  Evaluate symptoms of ADHD and gain insights into your attention and hyperactivity levels.
                  <strong>Professional screening at no cost.</strong>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() => updateState({ currentView: "gender", testType: "adhd" })}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Start FREE Assessment
                </Button>
              </CardFooter>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">FREE ASD Assessment</CardTitle>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">FREE</span>
                </div>
                <CardDescription>
                  Screen for Autism Spectrum Disorder and understand your social communication and interaction patterns.
                  <strong>Free professional screening tool.</strong>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() => updateState({ currentView: "gender", testType: "asd" })}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Start FREE Assessment
                </Button>
              </CardFooter>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">FREE Anxiety Assessment</CardTitle>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">FREE</span>
                </div>
                <CardDescription>
                  Assess your anxiety levels and identify potential triggers and coping mechanisms.
                  <strong>Free mental health screening.</strong>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() => updateState({ currentView: "gender", testType: "anxiety" })}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Start FREE Assessment
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-16">
            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Science-Backed Assessments</h3>
              <p className="text-slate-600 text-sm">
                Our assessments are based on validated psychological instruments and research-backed methodologies for
                accurate results.
              </p>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">100% FREE</h3>
              <p className="text-slate-600 text-sm">
                One of the few companies offering completely free cognitive assessments. No credit card required, no hidden fees.
              </p>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Instant Results</h3>
              <p className="text-slate-600 text-sm">
                Get immediate feedback on your cognitive abilities, mental health indicators, and personalized
                recommendations.
              </p>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Progress Tracking</h3>
              <p className="text-slate-600 text-sm">
                Monitor your mental health journey over time with detailed analytics and historical data comparison.
              </p>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-amber-900 mb-2">Important Medical Disclaimer</h4>
                <p className="text-amber-800 text-sm leading-relaxed">
                  These assessments are for educational and self-awareness purposes only. They are not a substitute for professional medical diagnosis, treatment, or advice. 
                  If you have concerns about your mental health, please consult with a qualified healthcare professional. 
                  These tools are not intended to diagnose, treat, cure, or prevent any medical condition.
                </p>
              </div>
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
                  Scientifically validated assessments to help you understand your cognitive abilities and mental
                  health.
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
                    <a href="/help" className="hover:text-slate-900 transition-colors">
                      Help & Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-100 mt-8 pt-8 text-center">
              <p className="text-slate-500 text-sm">
                © 2024 DataVine.ai. All rights reserved. | Made for better mental health awareness.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )

  const GenderSelectionPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {isAuthenticated && <AuthenticatedHeader />}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Personal Information</h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Help us personalize your assessment experience by selecting your gender identity
            </p>
          </div>

          {/* Gender Options */}
          <div className="space-y-4 mb-8">
            {[
              {
                id: "male",
                label: "Male",
                icon: "👨",
                gradient: "from-blue-500 to-cyan-500",
                hoverGradient: "from-blue-600 to-cyan-600",
              },
              {
                id: "female",
                label: "Female",
                icon: "👩",
                gradient: "from-pink-500 to-rose-500",
                hoverGradient: "from-pink-600 to-rose-600",
              },
              {
                id: "prefer-not-to-say",
                label: "Prefer not to say",
                icon: "✨",
                gradient: "from-slate-500 to-gray-600",
                hoverGradient: "from-slate-600 to-gray-700",
              },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => updateState({ currentView: "test" })}
                className={`group w-full p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-14 h-14 bg-gradient-to-br ${option.gradient} group-hover:${option.hoverGradient} rounded-xl text-white text-2xl transition-all duration-300 shadow-md`}
                  >
                    {option.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                      {option.label}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      {option.id === "male" && "Identifies as male"}
                      {option.id === "female" && "Identifies as female"}
                      {option.id === "prefer-not-to-say" && "Keep this information private"}
                    </p>
                  </div>
                  <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col space-y-4">
            <div className="text-center">
              <p className="text-sm text-slate-500 leading-relaxed">
                This information helps us provide more accurate assessment results and is kept completely confidential.
              </p>
            </div>

            <button
              onClick={() => updateState({ currentView: "home" })}
              className="flex items-center justify-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors py-3 px-4 rounded-xl hover:bg-slate-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const TestPage = () => {
    const questions = getCurrentQuestions()
    const currentQuestion: any = questions[questionIndex]

    // Get source information based on test type
    const getSourceInfo = () => {
      switch (appState.testType) {
        case "iq":
          return "Based on Wechsler Adult Intelligence Scale (WAIS-IV) and Raven's Progressive Matrices"
        case "adhd":
          return "Based on DSM-5 criteria and Adult ADHD Self-Report Scale (ASRS-v1.1)"
        case "asd":
          return "Based on Autism Spectrum Quotient (AQ) and Social Responsiveness Scale"
        case "anxiety":
          return "Based on GAD-7, Beck Anxiety Inventory, and validated anxiety scales"
        default:
          return ""
      }
    }

    return (
      <div className="min-h-screen bg-white">
        {/* Fixed progress bar at top of viewport */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
          <Progress value={((questionIndex + 1) / questions.length) * 100} className="h-1 rounded-none" />
        </div>

        {isAuthenticated && (
          <div className="pt-1">
            <AuthenticatedHeader />
          </div>
        )}

        <div className="flex items-center justify-center min-h-screen pt-2">
          <div className="max-w-4xl w-full p-6 bg-white rounded-2xl shadow-xl border border-slate-200 mx-4">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{getTestTitle()}</h2>

              {/* Source attribution */}
              <p className="text-xs text-slate-400 mb-2 leading-relaxed">{getSourceInfo()}</p>

              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="bg-slate-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-slate-700">
                    Question {questionIndex + 1} of {questions.length}
                  </span>
                </div>
                <div className="bg-blue-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-blue-700">
                    {Math.round(((questionIndex + 1) / questions.length) * 100)}% Complete
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 text-center leading-relaxed">
                {currentQuestion.question}
              </h3>
            </div>

            <VisualQuestionRenderer
              question={currentQuestion}
              selectedAnswer={answers[questionIndex]}
              onAnswerSelect={handleAnswer}
            />

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              >
                ← Back
              </Button>

              <div className="text-center">
                <p className="text-xs text-slate-500 mb-2">
                  {answers[questionIndex] !== undefined ? "Answer selected" : "Please select an answer"}
                </p>
              </div>

              <Button
                onClick={handleNext}
                disabled={answers[questionIndex] === undefined || isSubmittingTest}
                className="bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingTest ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  questionIndex === questions.length - 1 ? "Get Results" : "Next →"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const SuccessPage = () => {
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
      <div className="min-h-screen bg-white">
        {isAuthenticated && <AuthenticatedHeader />}
        <div className="flex items-center justify-center min-h-screen">
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
      </div>
    )
  }

  const FreeResultsPage = () => {
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

    const { testType, testResults } = appState
    const isIQTest = testType === "iq"

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

    if (!testResults) {
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
    let maxScore = 0

    if (isIQTest) {
      score = testResults.iqScore
      classification = getIQClassification(score)
    } else {
      score = testResults.score
      maxScore = testResults.maxScore
      if (testType === "adhd") classification = getADHDAssessment(score)
      if (testType === "asd") classification = getASDAssessment(score)
      if (testType === "anxiety") classification = getAnxietyAssessment(score)
    }

    return (
      <div className="min-h-screen bg-white">
        <AuthenticatedHeader />

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

              {isIQTest ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-900">{testResults.iqScore}</div>
                      <div className="text-sm text-slate-600">IQ Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-900">{testResults.percentile}%</div>
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
                      <Progress value={testResults.accuracy} />
                      <div className="text-sm text-slate-600 mt-2">
                        {testResults.totalCorrect} out of {testResults.totalQuestions}
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-slate-900 mb-2">Points Earned</div>
                      <Progress value={(testResults.totalPoints / testResults.maxPoints) * 100} />
                      <div className="text-sm text-slate-600 mt-2">
                        {testResults.totalPoints} out of {testResults.maxPoints}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Hide score display for ADHD, ASD, and Anxiety tests */}
                  {testType !== "adhd" && testType !== "asd" && testType !== "anxiety" && (
                    <div className="text-center mb-8">
                      <div className="text-4xl font-bold text-slate-900">
                        {score} / {maxScore}
                      </div>
                      <div className="text-sm text-slate-600">Total Score</div>
                    </div>
                  )}

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
                {appState.user?.usedCoupon || appState.user?.hasPaid ? (
                  <Button
                    onClick={() => updateState({ currentView: "detailed-results" })}
                    className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white"
                  >
                    View Detailed Results
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => updateState({ currentView: "payment" })}
                      className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      Unlock Detailed Results for $9.99
                    </Button>
                    {!showCouponField && (
                      <Button variant="ghost" onClick={handleSecretClick} className="w-full text-slate-600">
                        I have a coupon code
                      </Button>
                    )}
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

  const PaymentPage = () => (
    <div className="min-h-screen bg-white">
      {isAuthenticated && <AuthenticatedHeader />}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="bg-slate-900 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Choose Your Plan</h1>
            <p className="text-slate-600">Unlock detailed results and advanced features with our premium plans</p>
          </div>

          <PaymentForm 
            onSuccess={() => {
              updateState({ currentView: "detailed-results" })
              toast({
                title: "Payment Successful!",
                description: "Your subscription has been activated. You now have access to detailed results.",
              })
            }}
            onCancel={() => updateState({ currentView: "free-results" })}
          />
        </div>
      </div>
    </div>
  )

  const DetailedResultsPage = () => {
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

    const { testType, testResults } = appState
    const isIQTest = testType === "iq"

    if (!testResults) {
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
    let maxScore = 0

    if (isIQTest) {
      score = testResults.iqScore
      classification = getIQClassification(score)
    } else {
      score = testResults.score
      maxScore = testResults.maxScore
      if (testType === "adhd") classification = getADHDAssessment(score)
      if (testType === "asd") classification = getASDAssessment(score)
      if (testType === "anxiety") classification = getAnxietyAssessment(score)
    }

    return (
      <div className="min-h-screen bg-white">
        <AuthenticatedHeader />

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

              {isIQTest ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-900">{testResults.iqScore}</div>
                      <div className="text-sm text-slate-600">IQ Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-900">{testResults.percentile}%</div>
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
                      <Progress value={testResults.accuracy} />
                      <div className="text-sm text-slate-600 mt-2">
                        {testResults.totalCorrect} out of {testResults.totalQuestions}
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-slate-900 mb-2">Points Earned</div>
                      <Progress value={(testResults.totalPoints / testResults.maxPoints) * 100} />
                      <div className="text-sm text-slate-600 mt-2">
                        {testResults.totalPoints} out of {testResults.maxPoints}
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
              ) : (
                <>
                  {/* Hide score display for ADHD, ASD, and Anxiety tests */}
                  {testType !== "adhd" && testType !== "asd" && testType !== "anxiety" && (
                    <div className="text-center mb-8">
                      <div className="text-4xl font-bold text-slate-900">
                        {score} / {maxScore}
                      </div>
                      <div className="text-sm text-slate-600">Total Score</div>
                    </div>
                  )}

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
                    <p className="text-slate-700">
                      Based on your assessment results, we recommend exploring strategies to manage anxiety, such as
                      mindfulness exercises, cognitive behavioral therapy (CBT), and lifestyle adjustments.
                    </p>
                  </div>
                </>
              )}

              <Button onClick={resetTest} variant="outline" className="w-full h-12 bg-transparent">
                Take Another Assessment
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Dashboard Page Component
  const DashboardPage = () => (
    <div className="min-h-screen bg-white">
      <AuthenticatedHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>
          
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 mb-8 text-white">
            <h2 className="text-2xl font-semibold mb-2">Welcome back, {appState.user?.name || 'User'}!</h2>
            <p className="text-slate-300">Track your cognitive assessment progress and insights.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{appState.user?.assessmentHistory?.length || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-slate-900">{appState.user?.subscription || 'Free'}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Last Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-600">
                  {appState.user?.assessmentHistory?.length > 0 
                    ? appState.user.assessmentHistory[appState.user.assessmentHistory.length - 1]?.testType || 'None'
                    : 'No assessments yet'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest assessment results and progress</CardDescription>
            </CardHeader>
            <CardContent>
              {appState.user?.assessmentHistory?.length > 0 ? (
                <div className="space-y-4">
                  {appState.user.assessmentHistory.slice(-5).reverse().map((assessment: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          assessment.testType === 'iq' ? 'bg-blue-100' :
                          assessment.testType === 'adhd' ? 'bg-orange-100' :
                          assessment.testType === 'asd' ? 'bg-purple-100' :
                          'bg-green-100'
                        }`}>
                          <Brain className={`h-4 w-4 ${
                            assessment.testType === 'iq' ? 'text-blue-600' :
                            assessment.testType === 'adhd' ? 'text-orange-600' :
                            assessment.testType === 'asd' ? 'text-purple-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium capitalize">{assessment.testType} Assessment</p>
                          <p className="text-sm text-slate-600">
                            {assessment.testDate ? new Date(assessment.testDate).toLocaleDateString() : 'Recent'}
                            {assessment.score && ` • Score: ${assessment.score}/${assessment.maxScore || 100}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateState({ 
                            currentView: "detailed-results", 
                            testResults: assessment 
                          })}
                        >
                          View Results
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => updateState({ 
                            currentView: "gender", 
                            testType: assessment.testType 
                          })}
                        >
                          Retake
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">No assessments completed yet.</p>
                  <Button 
                    onClick={() => updateState({ currentView: "home" })}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    Start Your First Assessment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => updateState({ currentView: "gender", testType: "iq" })}
                >
                  <Brain className="h-6 w-6 mb-2" />
                  <span>Take IQ Test</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => updateState({ currentView: "profile" })}
                >
                  <User className="h-6 w-6 mb-2" />
                  <span>Update Profile</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => updateState({ currentView: "billing" })}
                >
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span>Manage Plan</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )

  // Profile Page Component
  const ProfilePage = () => (
    <div className="min-h-screen bg-white">
      <AuthenticatedHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={appState.user?.profilePicture || "/placeholder-avatar.jpg"} />
                    <AvatarFallback className="bg-slate-900 text-white text-2xl">
                      {appState.user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2">
                  <Button onClick={triggerFileInput} size="sm" className="w-full">
                    Upload Picture
                  </Button>
                  {appState.user?.profilePicture && (
                    <Button onClick={handleRemoveProfilePicture} variant="outline" size="sm" className="w-full">
                      Remove Picture
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Name</label>
                    <p className="text-lg">{appState.user?.name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <p className="text-lg">{appState.user?.email || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Phone</label>
                    <p className="text-lg">{appState.user?.phone || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Subscription</label>
                    <p className="text-lg">{appState.user?.subscription || 'Free'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>


        </div>
      </main>
    </div>
  )

  // Settings Page Component
  const SettingsPage = () => (
    <div className="min-h-screen bg-white">
      <AuthenticatedHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Account Settings</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Name</label>
                  <p className="text-lg">{appState.user?.name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <p className="text-lg">{appState.user?.email || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Account Created</label>
                  <p className="text-lg">{appState.user?.createdAt ? new Date(appState.user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Subscription Status</label>
                  <p className="text-lg">{appState.user?.subscription || 'Free'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-slate-600">Receive updates about your assessments</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Sharing</p>
                    <p className="text-sm text-slate-600">Allow anonymous data for research</p>
                  </div>
                  <Button variant="outline" size="sm">Disable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Assessment History</p>
                    <p className="text-sm text-slate-600">Keep your assessment results private</p>
                  </div>
                  <Button variant="outline" size="sm">Private</Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Enable Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full">
                  View Login History
                </Button>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Control your data and account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Export My Data
                </Button>
                <Button variant="outline" className="w-full">
                  Download Assessment History
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )

  // Billing Page Component
  const BillingPage = () => (
    <div className="min-h-screen bg-white">
      <AuthenticatedHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Payment Plans</h1>
          
          {/* Current Plan Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your current subscription status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{appState.user?.subscription || 'Free'} Plan</p>
                  <p className="text-slate-600">
                    {appState.user?.subscription === 'Free' 
                      ? 'Access to basic assessments and results'
                      : `Premium features until ${appState.user?.subscriptionExpiry || 'N/A'}`
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    {appState.user?.subscription === 'Free' ? '$0' : '$19.99'}
                  </p>
                  <p className="text-sm text-slate-600">per month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className={`border-2 ${appState.user?.subscription === 'Free' ? 'border-slate-900' : 'border-slate-200'}`}>
              <CardHeader>
                <CardTitle className="text-xl">Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="text-3xl font-bold">$0<span className="text-lg font-normal text-slate-600">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Basic IQ Assessment</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">ADHD Screening</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">ASD Assessment</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Anxiety Assessment</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Basic Results</span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  variant={appState.user?.subscription === 'Free' ? 'outline' : 'default'}
                  disabled={appState.user?.subscription === 'Free'}
                >
                  {appState.user?.subscription === 'Free' ? 'Current Plan' : 'Get Started'}
                </Button>
              </CardContent>
            </Card>

            {/* Basic Plan */}
            <Card className={`border-2 ${appState.user?.subscription === 'basic' ? 'border-slate-900' : 'border-slate-200'}`}>
              <CardHeader>
                <CardTitle className="text-xl">Basic</CardTitle>
                <CardDescription>Enhanced features and insights</CardDescription>
                <div className="text-3xl font-bold">$9.99<span className="text-lg font-normal text-slate-600">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Everything in Free</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Detailed Results</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Progress Tracking</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Assessment History</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Email Support</span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  variant={appState.user?.subscription === 'basic' ? 'outline' : 'default'}
                  disabled={appState.user?.subscription === 'basic'}
                  onClick={() => updateState({ currentView: "payment" })}
                >
                  {appState.user?.subscription === 'basic' ? 'Current Plan' : 'Upgrade to Basic'}
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className={`border-2 ${appState.user?.subscription === 'premium' ? 'border-slate-900' : 'border-slate-200'}`}>
              <CardHeader>
                <CardTitle className="text-xl">Premium</CardTitle>
                <CardDescription>Complete cognitive health suite</CardDescription>
                <div className="text-3xl font-bold">$19.99<span className="text-lg font-normal text-slate-600">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Everything in Basic</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">AI-Powered Insights</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Personalized Recommendations</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Advanced Analytics</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Priority Support</span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  variant={appState.user?.subscription === 'premium' ? 'outline' : 'default'}
                  disabled={appState.user?.subscription === 'premium'}
                  onClick={() => updateState({ currentView: "payment" })}
                >
                  {appState.user?.subscription === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Billing History */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your recent payments and invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {appState.user?.subscription === 'Free' ? (
                <p className="text-slate-600">No billing history available for free accounts.</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">{appState.user?.subscription} Plan</p>
                      <p className="text-sm text-slate-600">Monthly subscription</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$19.99</p>
                      <p className="text-sm text-slate-600">Paid</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-slate-900 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading DataVine...</h2>
          <p className="text-slate-600">Please wait while we prepare your experience.</p>
          <div className="mt-4">
            <Loader2 className="h-6 w-6 animate-spin text-slate-600 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

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
    case "dashboard":
      content = <DashboardPage />
      break
    case "profile":
      content = <ProfilePage />
      break
    case "settings":
      content = <SettingsPage />
      break
    case "billing":
      content = <BillingPage />
      break
    default:
      content = <HomePage />
  }

  return (
    <>
      {content}

      {/* Hidden file input for profile picture upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfilePictureUpload}
        className="hidden"
      />

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">
              {authMode === "signin" ? "Sign In" : authMode === "signup" ? "Create Account" : "Forgot Password"}
            </h2>
            
            {/* General error message */}
            {authErrors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{authErrors.general}</p>
              </div>
            )}

            {/* Forgot Password Success Message */}
            {forgotEmailSent && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">
                  Password reset email sent! Check your inbox for instructions.
                </p>
              </div>
            )}
            
            {/* Mode Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => handleAuthModeChange("signin")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  authMode === "signin"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleAuthModeChange("signup")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  authMode === "signup"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Forgot Password Form */}
            {authMode === "forgot" ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="forgot-email"
                    placeholder="Enter your email"
                    value={authForm.email}
                    onChange={handleEmailChange}
                    className={authErrors.email ? "border-red-300 focus:border-red-500" : ""}
                    required
                    aria-describedby={authErrors.email ? "email-error" : undefined}
                  />
                  {authErrors.email && (
                    <p id="email-error" className="text-sm text-red-600 mt-1" role="alert">{authErrors.email}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Reset Email...
                    </div>
                  ) : (
                    "Send Reset Email"
                  )}
                </Button>
              </form>
            ) : (
              /* Regular Sign In/Sign Up Form */
              <form onSubmit={handleAuth} className="space-y-4" autoComplete="off">
                {authMode === "signup" && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                      Name
                    </label>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Your Name"
                      value={authForm.name}
                      onChange={handleNameChange}
                      className={authErrors.name ? "border-red-300 focus:border-red-500" : ""}
                      required
                      minLength={2}
                      maxLength={50}
                      aria-describedby={authErrors.name ? "name-error" : undefined}
                    />
                    {authErrors.name && (
                      <p id="name-error" className="text-sm text-red-600 mt-1" role="alert">{authErrors.name}</p>
                    )}
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    value={authForm.email}
                    onChange={handleEmailChange}
                    className={authErrors.email ? "border-red-300 focus:border-red-500" : ""}
                    required
                    aria-describedby={authErrors.email ? "email-error" : undefined}
                  />
                  {authErrors.email && (
                    <p id="email-error" className="text-sm text-red-600 mt-1" role="alert">{authErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={authForm.password}
                    onChange={handlePasswordChange}
                    className={authErrors.password ? "border-red-300 focus:border-red-500" : ""}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    aria-describedby={authErrors.password ? "password-error" : undefined}
                  />
                  {authErrors.password && (
                    <p id="password-error" className="text-sm text-red-600 mt-1" role="alert">{authErrors.password}</p>
                  )}
                  {authMode === "signup" && (
                    <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600">
                      <p className="font-medium mb-1">Password requirements:</p>
                      <ul className="space-y-1">
                        <li className={authForm.password.length >= 8 ? "text-green-600" : ""}>
                          • At least 8 characters
                        </li>
                        <li className={/(?=.*[a-z])/.test(authForm.password) ? "text-green-600" : ""}>
                          • One lowercase letter
                        </li>
                        <li className={/(?=.*[A-Z])/.test(authForm.password) ? "text-green-600" : ""}>
                          • One uppercase letter
                        </li>
                        <li className={/(?=.*\d)/.test(authForm.password) ? "text-green-600" : ""}>
                          • One number
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                
                {authMode === "signup" && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      value={authForm.confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className={authErrors.confirmPassword ? "border-red-300 focus:border-red-500" : ""}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      aria-describedby={authErrors.confirmPassword ? "confirm-password-error" : undefined}
                    />
                    {authErrors.confirmPassword && (
                      <p id="confirm-password-error" className="text-sm text-red-600 mt-1" role="alert">{authErrors.confirmPassword}</p>
                    )}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {authMode === "signin" ? "Signing In..." : "Creating Account..."}
                    </div>
                  ) : (
                    authMode === "signin" ? "Sign In" : "Create Account"
                  )}
                </Button>
              </form>
            )}

            {/* Google Login Button */}
            {authMode !== "forgot" && (
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 border-slate-300 hover:bg-slate-50"
                  onClick={handleGoogleLogin}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>
            )}

            {/* Forgot Password Link */}
            {authMode === "signin" && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => handleAuthModeChange("forgot")}
                  className="text-sm text-slate-600 hover:text-slate-900 underline"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Back to Sign In Link */}
            {authMode === "forgot" && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => handleAuthModeChange("signin")}
                  className="text-sm text-slate-600 hover:text-slate-900 underline"
                >
                  Back to Sign In
                </button>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowAuthModal(false)
                  clearAuthErrors()
                  setForgotEmailSent(false)
                  setAuthForm({
                    email: "",
                    password: "",
                    name: "",
                    confirmPassword: "",
                  })
                }} 
                className="w-full text-slate-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

