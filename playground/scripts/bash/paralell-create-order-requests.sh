#!/bin/bash

curl \
-X POST \
-H "Content-Type: application/json" \
-H "Cookie: session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall5T0dVMk1EaGxaRFUyWkdKbU9HRmtaVEpoTXpjM1ppSXNJbVZ0WVdsc0lqb2lZV3hsZURKQVoyMWhhV3d1WTI5dElpd2lhV0YwSWpveE5qVXpORGszT1RrNGZRLkl2dGc4VkpsUzFZeXVxdUMtZ3Jva0wyeG1mRFg4WFJVNlRQOS1lc1hhN3MifQ==; Path=/; Domain=localhost; HttpOnly;" \
-d '{"data": {"newOrder": {"ticketId": "628e608a3af5bc571eb99973"}}}' \
http://localhost:3003/orders \
& \
curl \
-X POST \
-H "Content-Type: application/json" \
-H "Cookie: session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall5T0dVMk1EbG1aRFUyWkdKbU9HRmtaVEpoTXpjNE1pSXNJbVZ0WVdsc0lqb2lZV3hsZUROQVoyMWhhV3d1WTI5dElpd2lhV0YwSWpveE5qVXpORGs0TURFMmZRLnNmNU56OExPYXh4Ri1JS250VVE0d05DX3NmdzFjOWhmQ252UmRmZGo1dTgifQ==; Path=/; Domain=localhost; HttpOnly;" \
-d '{"data": {"newOrder": {"ticketId": "628e608a3af5bc571eb99973"}}}' \
http://localhost:3003/orders
