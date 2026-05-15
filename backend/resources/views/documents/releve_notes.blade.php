@extends('documents.layout')

@section('content')
    <div class="section">
        <div class="section-title">Relevé de Notes</div>

        <div class="info-row">
            <span class="info-label">Étudiant :</span>
            <span class="info-value">{{ $user->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Email :</span>
            <span class="info-value">{{ $user->email }}</span>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Module</th>
                    <th>CC1</th>
                    <th>CC2</th>
                    <th>Examen</th>
                    <th>Note Finale</th>
                </tr>
            </thead>
            <tbody>
                @forelse($notes as $note)
                <tr>
                    <td>{{ $note->module->nom ?? 'N/A' }}</td>
                    <td>{{ $note->cc1 ?? '-' }}</td>
                    <td>{{ $note->cc2 ?? '-' }}</td>
                    <td>{{ $note->examen ?? '-' }}</td>
                    <td><strong>{{ $note->note_finale }}</strong></td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" style="text-align: center;">Aucune note enregistrée</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <div class="info-row" style="margin-top: 20px;">
            <span class="info-label">Moyenne Générale :</span>
            <span class="info-value" style="font-size: 14pt; color: #1e40af; font-weight: bold;">{{ $moyenne_generale }}/20</span>
        </div>

        <p style="margin: 30px 0; text-align: justify;">
            Ce relevé de notes est délivré à l'intéressé(e) pour servir et valoir ce que de droit.
        </p>

        <div style="margin-top: 20px;">
            <span class="badge badge-success">Document Validé</span>
        </div>
    </div>
@endsection
