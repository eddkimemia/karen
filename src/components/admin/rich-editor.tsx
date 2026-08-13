"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const toolBtn = (active = false) =>
  cn(
    "flex h-8 w-8 items-center justify-center border border-ivory/15 text-ivory/70 transition-colors hover:border-gold hover:text-gold",
    active && "border-gold bg-gold/15 text-gold",
  );

export function RichEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class: "rich-editor min-h-[420px] px-5 py-4 outline-none",
      },
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[420px] animate-pulse border border-ivory/15 bg-royal-deep/60" />
    );
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const addImage = () => {
    const url = window.prompt(
      "Image URL (paste an Unsplash photo URL or CDN link)",
      "https://",
    );
    if (url && url !== "https://") {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-ivory/15 bg-royal-deep/60">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-ivory/15 px-3 py-2.5">
        <button type="button" className={toolBtn()} onClick={() => editor.chain().focus().undo().run()} aria-label="Undo">
          <Undo2 className="h-4 w-4" />
        </button>
        <button type="button" className={toolBtn()} onClick={() => editor.chain().focus().redo().run()} aria-label="Redo">
          <Redo2 className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-ivory/15" />
        <button
          type="button"
          className={toolBtn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={toolBtn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={toolBtn(editor.isActive("strike"))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={toolBtn(editor.isActive("code"))}
          onClick={() => editor.chain().focus().toggleCode().run()}
          aria-label="Inline code"
        >
          <Code className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-ivory/15" />
        <button
          type="button"
          className={toolBtn(editor.isActive("heading", { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={toolBtn(editor.isActive("heading", { level: 3 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Subheading"
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={toolBtn(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet list"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={toolBtn(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={toolBtn(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={toolBtn(editor.isActive("horizontalRule"))}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          aria-label="Divider"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-ivory/15" />
        <button
          type="button"
          className={toolBtn(editor.isActive("link"))}
          onClick={setLink}
          aria-label="Add link"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={toolBtn()}
          onClick={addImage}
          aria-label="Add image"
        >
          <ImagePlus className="h-4 w-4" />
        </button>
        <span className="ml-auto hidden text-[0.5625rem] uppercase tracking-[0.25em] text-ivory/35 sm:block">
          Rich text — formatting applies as you type
        </span>
      </div>
      <EditorContent
        editor={editor}
        placeholder={placeholder}
        className="rich-editor-wrap"
      />
    </div>
  );
}