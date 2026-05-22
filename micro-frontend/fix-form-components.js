#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BASE = '/home/user/services/micro-frontend';

const formFiles = [
  `${BASE}/mfe-permits/src/app/permit-form/permit-form.component.ts`,
  `${BASE}/mfe-lands/src/app/land-form/land-form.component.ts`,
  `${BASE}/mfe-grants/src/app/grant-form/grant-form.component.ts`,
  `${BASE}/mfe-cases/src/app/case-form/case-form.component.ts`,
  `${BASE}/mfe-registrations/src/app/registration-form/registration-form.component.ts`,
];

for (const filePath of formFiles) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the import to include inject
  content = content.replace(
    "import { Component, OnInit } from '@angular/core';",
    "import { Component, OnInit, inject } from '@angular/core';"
  );

  // Replace the constructor pattern with inject pattern
  content = content.replace(
    /export class (\w+) implements OnInit \{\n  form = this\.fb\.group\(\{([\s\S]*?)\}\);\n\n  loading = false;\n  error = '';\n  editId: string \| null = null;\n\n  constructor\(\n    private fb: FormBuilder,\n    private http: HttpClient,\n    private router: Router,\n    private route: ActivatedRoute,\n    private snackBar: MatSnackBar\n  \) \{\}/,
    (match, className) => {
      return `export class ${className} implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
  });

  loading = false;
  error = '';
  editId: string | null = null;`;
    }
  );

  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${path.basename(path.dirname(filePath))}/${path.basename(filePath)}`);
}

console.log('Done!');
