import React from 'react';
import Markdown from 'react-markdown';

const problemStatement = `
# Street Animal Rescue Web Platform
## Bridging the Gap in Urban Wildlife Welfare

### 1. Introduction
The urban landscape is home to millions of street animals who face daily threats of injury, starvation, and abandonment. In many developing regions, the population of stray animals is increasing exponentially, leading to a rise in road accidents and public health concerns. Currently, rescue efforts are fragmented, often relying on sporadic social media posts that lack the structure needed for rapid medical intervention. Delayed medical assistance often turns treatable injuries into fatal conditions.

### 2. Need for the System
There is a critical absence of a centralized, real-time reporting ecosystem. Existing solutions are either localized to small NGOs or buried within generic social media platforms, leading to:
- **Delayed Response Times**: Critical minutes are lost in manual coordination.
- **Lack of Visibility**: City and state-based authorities lack data on high-risk zones.
- **Rescue Fatigue**: Volunteers are often overwhelmed by unverified or duplicate reports.
- **Inefficient Resource Allocation**: No system exists to prioritize critical cases over healthy abandonments.

### 3. Objectives
- **Enable Fast Reporting**: A streamlined interface for citizens to report animals in distress within seconds.
- **Efficient Coordination**: Connect NGOs, veterinarians, and volunteers through a unified dashboard.
- **Support Adoption**: Create a transparent pipeline from rescue to rehabilitation and forever homes.
- **Location-Based Intelligence**: Ensure rescue coordination is optimized by proximity and urgency.
- **Automated Alerts**: Use real-time notifications to mobilize the nearest responders.

### 4. Advanced AI Integration (The Innovation Edge)
Our platform leverages state-of-the-art AI to transform passive reporting into active rescue:
- **🧠 Vision-Based Triage**: Gemini-powered image analysis automatically detects injury severity and animal type.
- **🚨 AI Priority Scoring**: Reports are automatically ranked (1-10) based on medical urgency, ensuring critical cases are handled first.
- **💬 Rescue Assistant Bot**: Provides immediate, condition-specific first-aid guidance to the reporter while help is on the way.
- **📊 Predictive Analytics**: Identifies "Hot Zones" for animal injuries, allowing NGOs to plan proactive vaccination or sterilization drives.
- **🛡 Content Moderation**: Ensures the platform remains a safe space by filtering inappropriate or fraudulent posts.

### 5. Social Impact
By digitizing the rescue pipeline, we aim to:
- **Reduce Animal Suffering** through faster response times.
- **Increase Adoption Rates** by providing a verified history of rescued animals.
- **Empower Communities** with the tools to make a tangible difference in their neighborhoods.
`;

export const ProblemStatement: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-black/5">
      <div className="markdown-body prose prose-slate max-w-none">
        <Markdown>{problemStatement}</Markdown>
      </div>
    </div>
  );
};
