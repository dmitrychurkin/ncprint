"use client";

import { mailchimp } from "@/resources";
import { Button, Heading, Input, Text, Background, Column, Row } from "@once-ui-system/core";
import { opacity, SpacingToken } from "@once-ui-system/core";
import { useRef, useState } from "react";

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
}

export const ContactForm: React.FC<React.ComponentProps<typeof Column>> = ({ ...flex }) => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  const validateEmail = (email: string): boolean => {
    if (email === "") return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const debouncedEmailChange = debounce(handleEmailChange, 2000);

  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          name,
          message
        }),
      });

      const result = await response.json();

      if (result.success) {
        formRef.current?.reset();
        setEmail("");
        setEmailError("");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
        console.error('Error:', result.error);
      }
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      console.error('Error:', error);
    }
  };

  return (
    <Column
      overflow="hidden"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
      {...flex}
    >
      {/* Success Toast */}
      {showSuccess && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '16px 24px',
            borderRadius: 'var(--radius-m)',
            background: 'var(--success-background-strong)',
            color: 'var(--success-on-background-strong)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          ✓ Message sent successfully!
        </div>
      )}

      {/* Error Toast */}
      {showError && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '16px 24px',
            borderRadius: 'var(--radius-m)',
            background: 'var(--danger-background-strong)',
            color: 'var(--danger-on-background-strong)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          ✗ Failed to send message. Please try again.
        </div>
      )}

      <Background
        top="0"
        position="absolute"
        mask={{
          x: mailchimp.effects.mask.x,
          y: mailchimp.effects.mask.y,
          radius: mailchimp.effects.mask.radius,
          cursor: mailchimp.effects.mask.cursor,
        }}
        gradient={{
          display: mailchimp.effects.gradient.display,
          opacity: mailchimp.effects.gradient.opacity as opacity,
          x: mailchimp.effects.gradient.x,
          y: mailchimp.effects.gradient.y,
          width: mailchimp.effects.gradient.width,
          height: mailchimp.effects.gradient.height,
          tilt: mailchimp.effects.gradient.tilt,
          colorStart: mailchimp.effects.gradient.colorStart,
          colorEnd: mailchimp.effects.gradient.colorEnd,
        }}
        dots={{
          display: mailchimp.effects.dots.display,
          opacity: mailchimp.effects.dots.opacity as opacity,
          size: mailchimp.effects.dots.size as SpacingToken,
          color: mailchimp.effects.dots.color,
        }}
        grid={{
          display: mailchimp.effects.grid.display,
          opacity: mailchimp.effects.grid.opacity as opacity,
          color: mailchimp.effects.grid.color,
          width: mailchimp.effects.grid.width,
          height: mailchimp.effects.grid.height,
        }}
        lines={{
          display: mailchimp.effects.lines.display,
          opacity: mailchimp.effects.lines.opacity as opacity,
          size: mailchimp.effects.lines.size as SpacingToken,
          thickness: mailchimp.effects.lines.thickness,
          angle: mailchimp.effects.lines.angle,
          color: mailchimp.effects.lines.color,
        }}
      />
      <Column maxWidth="xs" horizontal="center">
        <Heading marginBottom="s" variant="display-strong-xs">
          Contact Me
        </Heading>
        <Text wrap="balance" marginBottom="l" variant="body-default-l" onBackground="neutral-weak">
          Have a question or want to work together? Let's talk.
        </Text>
      </Column>
      <form
        ref={formRef}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
        onSubmit={handleSubmit}
      >
        <Column fillWidth maxWidth={24} gap="8">
          <Input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Name*"
            required
          />
          <Input
            id="contact-email"
            name="email"
            type="email"
            placeholder="Email*"
            required
            onChange={(e) => {
              if (emailError) {
                handleEmailChange(e);
              } else {
                debouncedEmailChange(e);
              }
            }}
            onBlur={handleEmailBlur}
            errorMessage={emailError}
          />
          <textarea
            id="contact-message"
            name="message"
            placeholder="Feel free to share details about your project, collaboration ideas, or just say hi!*"
            required
            rows={4}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "var(--radius-m)",
              border: "1px solid var(--neutral-alpha-medium)",
              background: "var(--neutral-alpha-weak)",
              color: "var(--neutral-on-background-strong)",
              fontFamily: "inherit",
              fontSize: "inherit",
              lineHeight: "1.5",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <Row height="48" vertical="center">
            <Button type="submit" size="m" fillWidth>
              Send message
            </Button>
          </Row>
        </Column>
      </form>
    </Column>
  );
};
