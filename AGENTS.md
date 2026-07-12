Repository Rules

Architecture

Current Decisions

How to work

How to create PR

Forbidden actions

Definition of Done

Context Economy

## Maximum scope

За одну задачу агент имеет право изменить
не более 5 файлов.

Если требуется больше —
остановиться и сообщить об этом.

## Context

Never read files that are not required for the current task.

Never search the whole repository unless TASK.md explicitly requires it.

## Completion

After completing the task:

- Stop immediately.
- Do not start the next task.
- Do not suggest code changes unless requested.