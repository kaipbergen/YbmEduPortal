import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/sections/footer";

export default function UniversityGuide() {
  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              University Application Guide
            </h1>
            <p className="text-lg text-muted-foreground">
              Your comprehensive resource for university admissions success
            </p>
          </div>

          <div className="mb-12">
            <img
              src="https://images.unsplash.com/20/cambridge.JPG"
              alt="University campus"
              className="w-full h-64 object-cover rounded-lg shadow-lg mb-8"
            />
          </div>

          <Tabs defaultValue="preparation" className="mb-12">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preparation">Test Preparation</TabsTrigger>
              <TabsTrigger value="application">Application Process</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>

            <TabsContent value="preparation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Preparation Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="ielts">
                      <AccordionTrigger>IELTS Requirements</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            Minimum band score of 6.5-7.5 for most universities
                          </li>
                          <li>Individual section scores of at least 6.0</li>
                          <li>Test must be taken within the last 2 years</li>
                          <li>
                            Academic IELTS required for university admission
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="sat">
                      <AccordionTrigger>SAT Guidelines</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Average score requirements: 1200-1500</li>
                          <li>Math section: 600-750 recommended</li>
                          <li>
                            Evidence-Based Reading and Writing: 600-750 recommended
                          </li>
                          <li>
                            Consider taking SAT Subject Tests for competitive programs
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="application" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {[
                        {
                          title: "Research Universities",
                          description:
                            "Identify target schools and programs that match your academic goals and qualifications.",
                        },
                        {
                          title: "Prepare Documents",
                          description:
                            "Gather transcripts, test scores, recommendations, and write your personal statement.",
                        },
                        {
                          title: "Submit Applications",
                          description:
                            "Complete online applications and pay application fees before deadlines.",
                        },
                        {
                          title: "Financial Planning",
                          description:
                            "Research scholarships and prepare financial documentation for visa applications.",
                        },
                      ].map((step, index) => (
                        <Card key={index} className="p-4">
                          <h3 className="font-bold mb-2">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      {[
                        {
                          title: "Academic Requirements",
                          items: [
                            "High school diploma or equivalent",
                            "Strong GPA (typically 3.0 or higher)",
                            "Standardized test scores (SAT/ACT)",
                            "English proficiency test scores (IELTS/TOEFL)",
                          ],
                        },
                        {
                          title: "Supporting Documents",
                          items: [
                            "Letters of recommendation",
                            "Personal statement/Essays",
                            "Activity resume",
                            "Portfolio (if applicable)",
                          ],
                        },
                      ].map((section, index) => (
                        <div key={index} className="bg-muted p-4 rounded-lg">
                          <h3 className="font-bold mb-3">{section.title}</h3>
                          <ul className="space-y-2">
                            {section.items.map((item, itemIndex) => (
                              <li
                                key={itemIndex}
                                className="text-sm flex items-center gap-2"
                              >
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Need Help with Your Application?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our experts are here to guide you through every step of the
              process
            </p>
            <Button size="lg" className="px-8">
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Footer rendered at the bottom */}
      <Footer />
    </>
  );
}
